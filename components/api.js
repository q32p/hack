const express = require('express');


var api = module.exports = express();
api.all('/task(:id)?', (req, res, next) => {
    res.status(200).json({
        id: req.params.id || 0,
        name: 'someTaskName'
    });

});

