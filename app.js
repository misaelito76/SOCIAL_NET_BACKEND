'use strict'

var express = require('express');
//var bodyParser = require('body-parser'); is deprecated so we use express now
var app = express();

//load routes
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow'); 
var publication_routes = require('./routes/publication'); 
var messages_routes = require('./routes/message'); 

//midddlewares
app.use(express.urlencoded({ extended: false }));//used to be body parser
app.use(express.json());

//cors
app.use((req, res, next) => {
    res.header('Access-control-Allow-Origin', '*');
    res.header('Access-control-Allow-Headers', 'Authorization, X-API-KEY,Origin,X-Requested-With, Content-Type, Accept,Access-Control-Allow-Request-Method');

    res.header('Access-control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');

    res.header('Allow', 'GET,POST,OPTIONS,PUT,DELETE');
    next();

})
//routes
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', messages_routes);


//exports
module.exports = app;