/**
 * Created by Amirka on 21.04.2017.
 */

var dl = require('../components/dl');
var cross = module.exports = (()=>{
    /* callback, prefix, scope */
    var g = dl.gname = function(c,p,s){
        if(isObject(c)){s = c.scope; p = c.prefix; c = c.callback;}
        s = s||g.scope; p = p||g.prefix;
        var n;
        s[n = p + (++uniqueID)] = function(r){c&&c(r); delete s[n];};
        return n;
    };
    g.prefix = 'DL_CALLBACK_';
    g.scope = window || {};
    return function(url, data, callback, delay, progress){
        isObject(url) && (
            progress = url.progress,
                data = url.data,
                callback = url.callback,
                delay = url.delay,
                url = url.url
        );
        var success = true;
        var execute = function(response){
            //console.log(success,response);
            destroy && (destroy(), destroy = 0, callback && callback(success, response) );
        };

        var src = _URL(url);

        var loc = _URL.extend(url, {
            data: [ data ].merge({
                hostname: _hostname,
                timestamp: (new Date()).getTime(),
                callback: g(execute)
            })
        });

        var destroy = _js(
            loc.href,
            function(_success){(success = _success) || execute({});},
            delay, progress
        );

        return function () {
            destroy && (destroy(), destroy = 0);
        };


    };
})();

var uniqueID = 0,  expSpace = /\+/g;
var exp20 = /%20/g, exp22 = /%22/g, exp3A = /%3A/g, exp2C = /%2C/g;
var expBrackets = /\[(.*?)\]/g, expVarname = /(.+?)\[/;
var _hostname = location ?  location.hostname : '';
var uid = cross.uid = function(){return ++uniqueID;};
var head = document && document.head;
var _loadProvider = (provider,init,callback,progress,delay) => {
    var stop, destroy, execute = function(){
        if(stop)return;
        if(callback){
            var state, success = 1, loaded = 0,
                execute = provider.onload = function(){
                    stop || loaded || (loaded = 1) && callback(success); // callback(success,options);
                };
            provider.onerror = function(){success = 0; execute();};
            provider.onreadystatechange = function(){
                ((state = s.readyState) == "complete" || state == "loaded") && execute();
            };
        }
        progress && (provider.onprogress = function(){stop || progress(arguments);});
        init && (destroy = init(provider));
    };
    delay ? setTimeout(execute,delay) : execute();
    return function(){
        stop || (stop = 1, destroy && destroy());
    };
};
var _append = (parent,node) => {
    parent.appendChild(node);
    return function(){ parent.removeChild(node); };
};
var _param = cross.param = (v,encode,excludePrefix)=>{
    var s = [], tmp, length = (excludePrefix || (excludePrefix = '$')).length;

    var build = function(p,v){
        if(isArray(v)){for(var i = 0, l = v.length; i < l; i++)build(p+'[' + i + ']',v[i]);return s;}
        if(isObject(v)){for(var k in v)build(p + '[' + k + ']',v[k]);return s;}
        isScalar(v) && s.push(encodeURIComponent(p)+'='+encodeURIComponent(v));
        return s;
    };
    if(isObject(v)){
        if(isArray(v)){
            var i = 0, l = v.length;
            if(encode){
                for(;i < l; i++)isEmpty(tmp = v[i]) || build(i,encode(tmp));
            }else{
                for(;i < l; i++)build(i,v[i]);
            }
        }else{
            var k;
            if(encode){
                for(k in v)excludePrefix === k.slice(0, length) ||
                isEmpty(tmp = v[k]) || build(k,encode(tmp));

            }else{
                for(k in v)excludePrefix === k.slice(0, length) || isEmpty(tmp = v[k]) || build(k,tmp);
            }
        }
    }
    return s.join('&').replace(exp20, '+').replace(exp22, '"').replace(exp3A, ':').replace(exp2C, ',');
};
var _fromJson = cross.fromJson = function(s){
    try{ return JSON.parse(s); }catch(e){}
    return null;
};
var _fromJsonOr = cross.fromJsonOr = function(s){
    try{ return JSON.parse(s); }catch(e){}
    return s;
};
 var _toJson = cross.toJson = function(){
    return JSON.stringify.apply(JSON,arguments);
};
var _toJsonOr = dl.toJsonOr = function(s){
    return isObject(s) ? JSON.stringify(s) : s;
};
var __unparam = function(s,decode){
    var r = {}, a, l = (a = decodeURIComponent((a = s.breakup('?',1))[1]).split('&')).length;
    if(l < 1)return r;
    for(var w, t, k, v, b, c, d, j, n, q, i = 0; i < l; i++){
        if((w = a[i]).length < 1)continue;
        if((k = (w = w.breakup('='))[0]).length < 1)continue;
        v = w[1].replace(expSpace,' ');
        b = [];
        while(w = expBrackets.exec(k))b.push(w[1]);
        if((c = b.length) < 1){
            r[k] = v;
            continue;
        }
        c--;
        w = expVarname.exec(k);
        if(!w || !(k = w[1]) || w.length < 1)continue;
        if(!isObject(d = r[k]))d = r[k] = {};
        for(j = 0, q = b.length; j < q; j++){
            if((w = b[j]).length < 1){
                w = 0;
                for(n in d){
                    if(!isNaN(n) && n >= 0 && (n%1 === 0) && n >= w)w = Number(n) + 1;
                }
            }
            if(j == c)d[w] = v; else d = isObject(t = d[w]) ? t : (d[w] = {});
        }
    }
    if(decode)for(k in r)r[k] = decode(r[k]);
    return r;
};
var _unparam = cross.unparam = function(s,decode){
    var type = typeof s;
    return type == 'string' ? __unparam(s, decode) : (type == 'object' ? s : {});
};
// парсит url
var __URL = function(url){
    var
        parts = url.breakup('#'),
        hash = parts[1],
        unhash = parts[0],
        unsearch = (parts = unhash.breakup('?'))[0],
        search = parts[1],
        data = __unparam(search,_fromJsonOr),
        child = hash ? __URL(hash) : {},
        protocol = (parts = unsearch.breakup('://',1))[0],
        pathname = protocol ? (parts = parts[1].breakup('/'))[1] : parts[1],
        host = protocol ? parts[0] : '',

        hostname = protocol ? (parts = host.breakup(':'))[0] : '',
        port = protocol ? parts[1] : '',
        unalias = (parts = unsearch.lastBreakup('/',1))[0] + '/',
        filename = parts[1],
        alias = (parts = filename.lastBreakup('.'))[0];
    return {
        href: url, search: search, unhash: unhash,
        hash: hash, data: data, protocol: protocol,
        pathname: pathname, hostname: hostname,
        host: host, port: port,
        unalias: unalias,
        dirname: host ? unalias.breakup(host, 1)[1] : unalias,
        filename: filename, alias: alias,
        unext: unalias + alias,
        ext: parts[1], unsearch: unsearch, child: child
    };
};
var _URL = cross.URL = function(url){
    return __URL(url || (location ? location.href : ''));
};
// парсит url и мерджит его параметры указанными аргументами
var _urlExtend = _URL.extend = function(dst,src){

    dst ? (isObject(dst) || (dst = __URL(dst))) : (dst = _URL());
    src ? (isObject(src) || (src = __URL(src))) : (src = {});


    var
        dirname = (src.dirname === undefined ? dst.dirname : src.dirname) || '',
        hostname = dst.hostname || src.hostname,
        protocol = (src.protocol === undefined ? dst.protocol : src.protocol) || dst.protocol || (hostname ? 'http' : ''),
        port = (src.protocol === undefined ? dst.port : src.port) || '',
        host = hostname ? (hostname + (port ? (':' + port) : '') ) : '';

    var unalias = (hostname ? (protocol + '://' + host ) : '') + dirname;

    var alias = (src.alias === undefined ? dst.alias : src.alias) || '';
    //console.log('alias',alias,dst.alias, src.alias);
    var
        ext = (src.ext === undefined ? dst.ext : src.ext) || '',
        filename = alias + (ext ? '.' + ext : ''),
        unext = unalias + alias,
        unsearch = unext + (ext ? '.' + ext : ''),
        pathname = dirname + filename,
        data = src.data === null ? {} : [src.data].merge(dst.data),
        search = _param(data,_toJsonOr),
        unhash = unsearch + (search ? '?' + search : ''),
        child = src.child ? _URL.extend(dst.child, src.child) : dst.child,
        hash = child && child.href || '',
        href = unhash + (hash ? '#' + hash : '');
    return {
        href: href,
        search: search, unhash: unhash,
        hash: hash, data: data,
        protocol: protocol, pathname: pathname,
        hostname: hostname, host: host, port: port,
        unalias: unalias,
        dirname: dirname, filename: filename,
        alias: alias, unext: unext,  ext: ext,
        unsearch: unsearch, child: child
    };
};
var _js = cross.js = (url, callback, progress, init) => {
    return _loadProvider(
        window.document.createElement('script'),
        function(provider){
            provider.type = 'text/javascript';
            provider.charset = 'utf-8';
            provider.async = true;
            provider.src = url;
            return init ? init(provider) : _append(head,provider);
        },
        callback, progress
    );
};
