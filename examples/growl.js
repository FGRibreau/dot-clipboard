var growl = require('growl');
module.exports = {
  run: function(data, f){
    // growl(data);
    f();
  }
};
