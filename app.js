'use strict'

var express = require('express');
//var bodyParser = require('body-parser'); is deprecated so we use express now
var app = express();

//load routes
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow'); 
//midddlewares
app.use(express.urlencoded({ extended: false }));//used to be body parser
app.use(express.json());

//cors

//routes
app.use('/api', user_routes);
app.use('/api', follow_routes);

//exports
module.exports = app;