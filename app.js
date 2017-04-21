const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var component = global.component = (base => name => require(base + name))(__dirname + '/components/');


var app = express();
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
//const methodOverride = require('method-override');
//http.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());


app.use(component('none-slash'));


app.use('/api', component('api'));


app.use((req, res, next) => {
    req.method = 'GET';
    next();
});
app.use(component('none-html')(__dirname + '/public'));

var staticOptions = {
    maxAge: 86400000
};
app.use(express.static( __dirname + '/public', staticOptions));

app.all('/*', (req, res, next) => {
    res.status(404).send('Error 404. Page not found!');
});

var port = 80;
app.listen(port, () => {
    console.log('Port ' + port + ' listening!');
});







