const fs = require('fs');
var regexpHtmlSuffix = /(\/|\.html)$/im;
var regexpTestSuffix = /\.[^\/\.]*$/im;
module.exports = (publicPath)=>{
    return (req, res, next) => {
       if(regexpTestSuffix.test(req.path))return next();
       var _path = publicPath + req.path.replace(regexpHtmlSuffix, '') + '.html';
       try{
           var html = fs.readFileSync(_path);
           return res.end(html);
       }catch(ex){}
       next();
   }
};
