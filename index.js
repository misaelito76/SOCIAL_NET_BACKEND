'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;
//connection to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/HKS', { useNewUrlParser: true })
    .then(() => {
        console.log("DB its Connected");
        //create server
        app.listen(port, () => {
            console.log('server running on port' + ' ' +  port)
        })
    })
    .catch(err => console.log(err));


    
    