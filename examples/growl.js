try{
  var growl = require('growl');
}catch(err){
  console.error("[Error] '%s' requires the 'growl' packages to work", __filename);
  console.error("[Error] run 'cd %s && npm install growl' and restart dot-clipboard (or edit growl.js).", __dirname);
}
module.exports = {
  run: function(data, f){
    // growl(data);
    f();
  }
};
