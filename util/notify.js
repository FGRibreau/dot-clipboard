'use strict';

var growl = require('growl');
var async = require('async');
var _     = require('lodash');

var queue = async.queue(function notify(task, f){
  growl(task.msg, { title: process.title});
  setTimeout(f, 5*1000);
}, 1);


function notify(msg){
  log(msg);
  queue.push({msg: msg.toString()});
}

function log(msg){
  console.log(new Date(), msg.toString());
}

module.exports         = addFormat(notify);
module.exports.console = addFormat(log);

// Helper
function addFormat(f){
  f.format = function(msg){
    return function(/* args... */){
      f(_.toArray(arguments).reduce(function(str, val, i){
        return str.replace('$'+i, val);
      }, msg));
    };
  };
  return f;
}


