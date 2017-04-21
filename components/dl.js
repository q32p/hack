/**
 * Created by Amirka on 19.02.2017.
 */

'use strict';

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

