'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = Schema({
    name: String,
    surname: String,
    petName: String,
    email: String,
    password: String,
    role: String,
    image: String,
    age: String,
    animal: String,
    race: String,
    sex: String,
    allergies: String,
    vaccination: String,
    licensing: String,
    status: String,
    comments: String,
    address: String,
    mobile: String,
    
});
module.exports = mongoose.model('User', UserSchema);
