'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret= 'un_ayuwoki_+_un_ayuwoki_son_dos_ayuwokis'//no hacker can break 2 ayuwokis
//here user is a parameter defined by a variable(payload) which contains an object
//with user data i want to code inside the token
exports.createToken=function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        nick: user.nick,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),//token creation date by jwt
        exp: moment().add(30, 'days').unix
    };
    //with the method encode we generate a token
    //passing the parameter payload with all data 
    //and as second parameter a secret key
    return jwt.encode(payload, secret);//this method generates a hash based on 
    //the payload and the secret parameters
};