module.exports = function cleanRequireCache(req, moduleFullPath){
  Object.keys(req.cache)
    .filter(function(key){
      return key === moduleFullPath;
    })
    .forEach(function(key){
      delete req.cache[key];
    });
};
