'use strict';

var Interface = require('./util/Interface');

module.exports = Interface('ScriptInterface', {
  /**
   * @param  {String} clipboardData
   * @param  {Function} f(err)
   */
  run: function (clipboardData, f) {}
});
