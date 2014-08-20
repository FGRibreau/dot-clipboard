/*global process, require */
'use strict';

process.title         = 'dot-clipbaord';

var DOT_CLIPBOARD_DIR = process.env.DOT_CLIPBOARD_DIR;

var clipboardWatcher  = require('clipboard-watcher');

var notify            = require('./util/notify');
var Dots              = require('./lib/Dots');

var dots = new Dots(DOT_CLIPBOARD_DIR)
.on('error', notify)
.on('init:loading', notify.console.format('Loading $0'))
.on('watch:start', notify.format('Starting to monitor "$0" folder'))
.on('watch:module:changed', notify.format('Reloading "$0" module'))
.on('watch:module:renamed', notify.format('Removing "$0" module and loading "$1" instead'))
.loadScripts(function(){
  clipboardWatcher(dots.onChangedClipboard.bind(dots), 500);
});
