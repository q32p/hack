const dl = component('dl');

var reAll = /\/(\/+)/im;
var reSuffix = /(\/+)$/im;
var replacerAll = (haystack, v1) => '/';
var replacerSuffix = (haystack, v1) => '';

module.exports = (req, res, next) => {
    var originalUrl = req.originalUrl;
    var parts = originalUrl.breakup('?');
    var url = parts[0].replace(reAll, replacerAll).
     replace(reSuffix, replacerSuffix) + (parts[1] ? ('?' + parts[1]) : '') || '/';
    originalUrl.length == url.length ? next() : res.redirect(url);
};