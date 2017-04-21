'use strict';

var dl = require('../components/dl');
var app = module.exports = {};

var dl = require('../frontend/cross');
var cross = require('../frontend/cross');


var loop = app.loop = [()=>{
    loop.debounce = true;
    cross('http://dev.markitondemand.com/Api/v2/Quote/jsonp', {
        symbol: "AAPL"

    }, (success, response)=>{

        loop.debounce = false;

        console.log('success, response', success, response.LastPrice);
    });

}].go(5000, Infinity, true);