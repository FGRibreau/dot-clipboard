'use strict';

var async           = require('async');
var ScriptInterface = require('./ScriptInterface');

function ScriptWrapper(name, path){
  /**
   * Script name (ending with .js)
   * @type {String}
   */
  this.name = name;

  /**
   * Full script path (include filename)
   * @type {String}
   */
  this.path = path;

  /**
   * Exported function
   * @type {Function} f(err)
   */
  this.script    = null;

  /**
   * [CONCURRENCY description]
   * @type {Number}
   */
  this.CONCURRENCY = 1;
}

/**
 * Try to load a script
 * @param  {Function} f(err, script{ScriptWrapper})
 */
ScriptWrapper.prototype.load = function(f){
  try{
    this.script = require(this.path);
  } catch(err){
    return f(new Error('Could not load  "'+this.name+'", error : ' + err));
  }

  // forward the name
  this.script.__name__ = this.name;

  try{
    ScriptInterface.ensureImplements(this.script);
  } catch(err){
    return f(err);
  }

  /**
   * Exported function concurrency
   * @type {Number}
   */
  this.CONCURRENCY = this.script.CONCURRENCY || this.CONCURRENCY;

  this.queue = async.queue(this.process.bind(this), this.CONCURRENCY);

  f(null, this);
};

ScriptWrapper.prototype.process = function(task, f){
  this.script.run(task.data, f);
};

ScriptWrapper.prototype.handle = function(data){
  this.queue.push({data: data});
};

ScriptWrapper.prototype.getName = function(){
  return this.name;
};

ScriptWrapper.prototype.getFullPath = function(){
  return this.path;
};

module.exports = ScriptWrapper;
