'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret= 'un_ayuwoki_+_un_ayuwoki_son_dos_ayuwokis'//no hacker can break 2 ayuwokis

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'the request have no header authentication'
        });

    }
    var token = req.headers.authorization.replace(/["']+/g, '');

    try {
        var payload = jwt.decode(token, secret);//here we clean the token and set it to the token var
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
        message:'token has expired'
    })
}
    } catch (ex) {
        return res.status(403).send({ message: 'invalid token'})
  
    };
    req.user = payload;
    next()
}