'use strict';
/**
 * MAC OSX ONLY
 */

// npm install request
var request    = require('request');
var exec       = require('child_process').exec;
var crypto     = require('crypto');
var os         = require('os');
var async      = require('async');
var path       = require('path');
var fs         = require('fs');

module.exports = {
  // Options
  options: {
    // gif output directory (you should definitely change this)
    outputDir: path.resolve(process.env.HOME, '/Dropbox/Public'),
    tmpOutputDir: os.tmpdir(),

    // should we ask you for tagging the gif
    askForTags: true,

    // truncate the file sha1 to 6 chars
    truncateSha1To: 6,

    // separator between sha1 and tags
    separator: '-'
  },


  /**


   Steps
   -----

   1 - download the gif inside a temporary folder
    2 - generate a sha1 of the gif
    3 - check that it does not exist in `options.outputDir`
      4 - If it exists : stop there
      4 - If it does not exist :
        5 - ask for tags
        6 - move (and rename) it to output folder

   * @param  {String} link
   * @param  {Function} f(err)
   */
  run: function(link, f){
    link = link.trim();

    // must match : http(s)://something.gif
    if(!endsWith(link, '.gif') || !(startWith(link, 'http://') || startWith(link, 'https://'))){
      // not a gif, skipping
      return f();
    }

    async.waterfall([
      // 1-2
      downloadGifAndChecksum.bind(null, this.options, link),
      // 3
      checkIfGifExist.bind(null, gifNameComparator(this.options), this.options),
    ], function(err, tmpFile, fileSha1, alreadyExist){
      if(err || alreadyExist){
        return f(err);
      }

      async.waterfall([
        // 5
        askForTags.bind(null, this.options, link),
        // 6
        moveToOutputDir.bind(null, tmpFile, fileSha1, this.options)
      ], f);

    }.bind(this));
  }
};



/**
 * Download the gif while generating its sha1 checksum
 * @param  {String} link http(s) link
 * @param  {Function} f(err, tmpFile, fileSha1)
 */
function downloadGifAndChecksum(options, link, f){
  var tmpFile = path.resolve(options.tmpOutputDir, +new Date() + '.gif');
  var hash    = crypto.createHash('sha1');
  hash.setEncoding('hex');

  // @todo do a HEAD first to verify that `link` is really a gif
  var req = request(link)
  .on('error', function(err){
    f(err);
  })
  .on('end', function(){
    hash.end();
    f(null, tmpFile, hash.read());
  });

  req.pipe(hash, { end: false });

  // @todo don't write the file, just forward the buffer to `f`
  req.pipe(fs.createWriteStream(tmpFile));
}

/**
 * @param  {String} tmpFile
 * @param  {String} fileSha1
 * @param  {Function} f(filename) : Bool
 * @param  {Function} f(tmpFile, fileSha1, comparator, alreadyExist : Bool)
 */
function checkIfGifExist(comparator, options, tmpFile, fileSha1, f){
  // list files in directory
  fs.readdir(options.outputDir, function(err, files){
    if(err){return f(err);}
    f(null, tmpFile, fileSha1, files.filter(comparator(fileSha1)).length > 0);
  });
}

function gifNameComparator(options){
  return function(fileSha1){
    return function(filename){
      return filename.split(options.separator)[0] === fileSha1.substring(0, options.truncateSha1To);
    };
  };
}

/**
 * Ask the user for tags (if `askForTags` was set to `true`)
 * @param  {String} gifLink [description]
 * @param  {Function} f(tags)
 */
function askForTags(options, gifLink, f){
  if(!options.askForTags){
    return f();
  }

  var promptTitle = 'Enter tags (separated by \'-\') for gif ('+gifLink+')';
  var cmd = "osascript -e 'Tell application \"System Events\" to display dialog \""+promptTitle+"\" default answer \"\"' -e 'text returned of result' 2>/dev/null";
  exec(cmd, function (error, stdout /*, stderr*/) {
    f(null, stdout);
  });
}

/**
 * @param  {String} tmpFile  temporary file full path
 * @param  {String} fileSha1 file sha1
 * @param  {Object} options  options
 * @param  {String} tags     tags delimited by "-"
 * @param  {Function} f(err)
 */
function moveToOutputDir(tmpFile, fileSha1, options, tags, f){
  var file = path.resolve(options.outputDir, fileSha1.substring(0, options.truncateSha1To) + (tags ? options.separator + tags : '').trim() + '.gif').trim();
  fs.rename(tmpFile, file, f);
}

// Insensitive endsWith
function endsWith(str, ends){
  return str.toLowerCase().lastIndexOf(ends.toLowerCase()) === str.length - ends.length;
}

// Insensitive startWith
function startWith(str, start){
  return str.toLowerCase().indexOf(start.toLowerCase()) === 0;
}
