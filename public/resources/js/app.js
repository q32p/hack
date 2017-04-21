var app =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dl = __webpack_require__(2);
var app = module.exports = {};

var dl = __webpack_require__(1);
var cross = __webpack_require__(1);


var loop = app.loop = [()=>{
    loop.debounce = true;
    cross('http://dev.markitondemand.com/Api/v2/Quote/jsonp', {
        symbol: "AAPL"

    }, (success, response)=>{

        loop.debounce = false;

        console.log('success, response', success, response.LastPrice);
    });

}].go(5000, Infinity, true);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Amirka on 21.04.2017.
 */

var dl = __webpack_require__(2);
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/**
 * Created by Amirka on 19.02.2017.
 */



var gl = global;
var dl = module.exports = {};
var
    isObject = gl.isObject = function(v){return v === null ? false : ((typeof v) == 'object');},
    isArray = gl.isArray = Array.isArray ? Array.isArray : function(v){return ( v instanceof Array );},
    isBoolean = gl.isBoolean = function(v){return (typeof v) == 'boolean';},
    isNumber = gl.isNumber = function(v){return (typeof v) == 'number';},
    isNumeric = gl.isNumeric = function(v){return !isNaN(v = parseFloat(v)) && isFinite(v);},
    isFunction = gl.isFunction = function(v){return (typeof v) == 'function';},
    isString = gl.isString = function(v){return (typeof v) == 'string';},
    isScalar = gl.isScalar = function(v){return (/string|number|boolean/).test(typeof v);},
    isEmptyObject = gl.isEmptyObject = function(m){
        if(!isObject(m))return true;
        for(var k in m)return false;
        return true;
    },
    isEmpty = gl.isEmpty = function(m){
        if(!isObject(m))return (m === null || m === undefined || (isString(m) && !m ));
        if(isArray(m))return m.length < 1;
        for(var k in m)return false;
        return true;
    },
    _isNotEqual = function(d, s, depth){
        if(d === s)return false;
        if( depth < 1 || !(isObject(d) && isObject(s)) )return true;
        var k, map = {};
        for(k in d){
            if(_isNotEqual(d[k], s[k], depth - 1))return true;
            map[k] = true;
        }
        for(k in s){
            if(!map[k] && _isNotEqual(s[k], d[k], depth - 1))return true;
        }
        return false;
    },
    isEqual = gl.isEqual = function(d,s,depth){
        return !_isNotEqual(d, s, intval(depth, 10) );
    },
    _isNotLike = function(d, s, depth){
        if(d === s)return false;
        if( isBoolean(d) && (d == !!s) )return false;
        if( depth < 1 || !(isObject(d) && isObject(s)) )return true;
        var k;
        for(k in d){
            if(_isNotLike(d[k], s[k], depth - 1))return true;
        }
        return false;
    },
    isLike = gl.isLike = function(d,s,depth){
        return !_isNotLike(d, s, intval(depth, 10) );
    };


var
    modval = function (m){
        function f(n,d,t){return t == 'boolean' ? (n ? 1 : 0) : (t == 'number' ? (isNaN(n) ? d || 0 : n) : (t == 'string' ? (isNaN(n = m(n)) ? d || 0 : n): d || 0 ));}
        return function(v,d,n){return isNumeric(v = f(v,d,typeof v)) && n !== undefined && v < n ? n : v;};
    },
    intval = gl.intval = modval(parseInt), floatval = gl.floatval = modval(parseFloat),
    stringval = gl.stringval = function(v,d){d = (d === undefined ? '' : d); return ''+(isScalar(v) ? (v === '' ? d : v) :d);},
    objectval = gl.objectval = function(v,d){return isObject(v) ? v : (d === undefined ? {} : d);},
    arrayval = gl.arrayval = function(v,d){return isArray(v) ? v : (d === undefined ? (v === undefined ? [] : [ v ]) : d);},
    watchval = gl.watchval = function(v){return isArray(v) ? v : (isFunction(v) ? [v] : [] );};
var
    _extend = dl._extend = function(dst,src,depth){
        if(src === undefined)return dst;
        if(depth < 1 || !isObject(src) || isArray(src))return src;
        isObject(dst) || (dst = {});
        depth--;
        for(var k in src)dst[k] = _extend(dst[k],src[k],depth);
        return dst;
    },
    _separator = /[\s;,]*/,

    /* prototype define */
    proto = function(_class,_property,_method){
        return _class.prototype[_property] || (_class.prototype[_property] = _method);
    };


proto(Array,'forEach',function(callback,context){
    if(!isFunction(callback))return;
    var z = this, _context = arguments.length > 1 ? context : z, l = z.length, i = 0;
    for(; i < l; i++)callback.call(_context, z[i], i, z);
});

proto(Array,'merge',function(dst, depth, include, exclude){
    var _dst = dst || {}, _depth = intval(depth);
    if(_depth < 0)return _dst;
    var _tmp, i, l = this.length, k;
    if(include){
        isArray(include) || (include = include.split(_separator));
        var ki, kl = include.length;
        for(i = 0; i < l; i++){
            if(!isObject(_tmp = this[i]) || isArray(_tmp))continue;
            for(ki = 0; ki < kl; ki++){
                k = include[ki];
                _dst[k] = _extend(_dst[k], _tmp[k], _depth);
            }
        }
        return _dst;
    }
    if(exclude){
        for(i = 0; i < l; i++){
            if(!isObject(_tmp = this[i]) || isArray(_tmp))continue;
            for(k in _tmp)exclude.indexOf(k) > -1 || (_dst[k] = _extend(_dst[k], _tmp[k], _depth));
        }
        return _dst;
    }
    for(i = 0; i < l; i++){
        if(!isObject(_tmp = this[i]) || isArray(_tmp))continue;
        for(k in _tmp)_dst[k] = _extend(_dst[k], _tmp[k], _depth);
    }
    return _dst;
});


proto(String,'breakup',function(v,right){
    var i = this.indexOf(v);
    return i < 0 ? (right ? [ '',  this ] : [ this, '' ]) :
        [ this.substr(0,i), this.substr(i + v.length) ];
});

proto(String,'lastBreakup',function(v,right){
    var i = this.lastIndexOf(v);
    return i < 0 ? (right ? [ '',  this ] : [ this, '' ]) :
        [ this.substr(0,i), this.substr(i + v.length) ];
});
proto(String,'lastBreakups',function(vals,right){
    var j = 0, l = vals.length, i = 0, maxi, maxv, v = '';
    for(;j < l; j++)(maxi = this.lastIndexOf(maxv = vals[j])) > i && (i = maxi, v = maxv);
    return i < 0 ? (right ? [ '',  this ] : [ this, '' ]) :
        [ this.substr(0,i), this.substr(i + v.length) ];
});

(function(){
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    var reg = /[-[\]{}()*+?.,\\^$|#\s]/g;
    proto(String,'trim',function(){return this.replace(rtrim,'');});
    proto(String,'regesc',function(){return this.replace(reg,"\\$&");});
})();

/* delay, count, first is not delay, arguments, context */
proto(Array,'goer',function(delay,count,first,args,context){
    var promise;
    var run = function(){
        cancel();
        promise = function(v){
            var count = run.count;
            if(ex && (count === Infinity || i < count)){
                timeoutID && clearTimeout(timeoutID);
                timeoutID = ex = run.debounce = 0;
                cancel.canceled = true;
                return v === undefined ? 1 : v;
            }
        };
        var timeoutID;
        var ul = run.ul;
        var delay = run.delay, ex = run.debounce = 1, i = run.i = 0,
            execute = function(){
                var count = run.count;
                if(ex && (count === Infinity || i < count)){
                    run.i = ++i;
                    for(var l = ul.length, j = 0; j < l; j++)ul[j].apply(context,args);
                    timeoutID = setTimeout(execute, run.delay);
                }else run.debounce = 0;
            };
        cancel.canceled = false;
        first || delay < 1 ? execute() : (timeoutID = setTimeout(execute, delay));
        return cancel;
    };
    var cancel = run.cancel = function(v){return promise && promise(v);};
    run.ul = this;
    run.count = count === Infinity ? count : intval(count, 1);
    run.delay = intval(delay);
    return run;
});
proto(Array,'go',function(){
    return this.goer.apply(this, arguments)();
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);