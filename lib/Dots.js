'use strict';

var fs           = require('fs');
var Walker       = require('walker');
var _            = require('lodash');
var p            = require('path');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var ScriptWrapper     = require('./ScriptWrapper');
var cleanRequireCache = require('./util/cleanRequireCache');

function Dots(dotDir){
  EventEmitter.call(this);
  this.dotDir  = dotDir || p.resolve(process.env.HOME, './.clipboard');
  this.scripts = []; // Array[ScriptWrapper]
}

util.inherits(Dots, EventEmitter);

/**
 * Load dots modules
 * @param  {[type]} f [description]
 * @return {[type]}   [description]
 */
Dots.prototype.loadScripts = function(f){

  var logger = function(filename){
    this.emit('init:loading', filename);
    return filename;
  }.bind(this);

  var skipNonJsFilesThenLogAndLoadScript = onlyKeepJsFiles(_.compose(this.loadScript.bind(this), logger));

  Walker(this.dotDir)
    .filterDir(function(dir /*, stat*/) {
      return dir === this.dotDir;
    }.bind(this))
    .on('file', skipNonJsFilesThenLogAndLoadScript)
    .on('symlink', skipNonJsFilesThenLogAndLoadScript)
    .on('error', this.emit.bind(this, 'error'))
    .on('end', function() {
      // start watch
      this.watch();
      f();
    }.bind(this));

  return this;
};

/**
 * [loadScript description]
 * @param  {String} name module name
 */
Dots.prototype.loadScript = function(name){
  var fullpath     = p.resolve(this.dotDir, name);

  // Check that the module is not already loaded
  // if it is, first remove it
  this.unloadScript(name, fullpath);

  new ScriptWrapper(name, fullpath)
  // require it
  .load(function(err, scriptWrapper){
    if(err){
      return this.emit('error', err);
    }

    // then add it to the scripts list
    this.scripts.push(scriptWrapper);
  }.bind(this));
};

Dots.prototype.unloadScript = function(name, fullpath){
  cleanRequireCache(require, fullpath);

  this.scripts = this.scripts.filter(function(module){
    // @todo maybe use ask for a "dispose" method ?
    return module.getName() !== name;
  });
};


Dots.prototype.watch = function(){
  /**
   * @type {String|null} will be set if a renaming is occuring
   */
  var renameFile = null;

  this.emit('watch:start', this.dotDir);

  fs.watch(this.dotDir, function(type, filename){
    if(!isJsFile(filename)){
      // not a js file, skipping
      return;
    }

    if(type === 'rename' && !renameFile){
      renameFile = filename;
      return;
    }

    if(type === 'rename' && renameFile){
      this.emit('watch:module:renamed', renameFile, filename);
      // from `renameFile` to `filename`
      // remove the module with `renameFile`
      this.unloadScript(renameFile);
      // add the module with `filename`
      this.loadScript(filename);
      return;
    }

    if(type === 'change'){
      this.emit('watch:module:changed', filename);
      // add (or remove and add again) the module with `filename`
      this.loadScript(filename);
      return;
    }

    // unhandled
    this.emit('error', new Error('Unhandled watch event "'+type+'"'));
  }.bind(this));
};

Dots.prototype.onChangedClipboard = function(data){
  data = String(data || '');
  console.log('[clipboard]', data);
  this.scripts.forEach(function(module){
    module.handle(data);
  });
};

function onlyKeepJsFiles(f){
  return function(filename){
    if(!isJsFile(filename)){
      return;
    }

    return f(filename);
  };
}

function isJsFile(filename){
  return p.extname(filename).toLowerCase() === '.js';
}

module.exports = Dots;
