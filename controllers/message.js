'use strict'
//*****************/libraries*********************
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
//************** */Models***************************
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');
function test(req, res) {
    res.status(200).send({ message: 'hola q tal!' });

}
function saveMessage(req, res) {
    var params = req.body;
    if (!params.text || !params.receiver)
        return res.status(200).send({
            message: 'send the required data'
        });
    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.viewed = 'false';
    message.created_at = moment().unix();
    message.save((err, messageStored) => {
        if (err) return res.status(500).send({
            message: 'there is been an error in the request'
        })
        if (!messageStored) return res.status(500).send({
            message: 'there is been an error sending the message'
        });
        return res.status(200).send({
            message:messageStored
        })
    })
    
    
    
};
function getReceivedMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    };
    var itemsPerPage = 4;
    Message.find({ receiver: userId }).populate('emitter', 'name nick surname image _id').paginate(page, itemsPerPage, (err, messageStored, total) => {
        if (err) return res.status(500).send({
            message: 'there is been an error in the request'
        })
        if (!messageStored) return res.status(404).send({
            message: 'there is no messages'

        });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messageStored
        })
    })
};
function getEmmitedMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    };
    var itemsPerPage = 4;
    Message.find({ emitter: userId }).populate('emitter receiver', 'name nick surname image _id').paginate(page, itemsPerPage, (err, messageStored, total) => {
        if (err) return res.status(500).send({
            message: 'there is been an error in the request'
        })
        if (!messageStored) return res.status(404).send({
            message: 'there is no messages'

        });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messageStored
        })
    })
};
function getUnviewedMessages(req, res) {
    var userId = req.user.sub;
    Message.count({ receiver: userId, viewed: 'false' }).exec((err, count) => {
        if (err) return res.status(500).send({ message: 'error in the request' });
        return res.status(200).send({
            'unviewed':count
        })
    })
}
function markedAsRead(req, res) {
    var userId = req.user.sub;
    Message.updateMany({ receiver: userId, viewed: 'false' }, { viewed: 'true' }, { "multi": true }, (err, messageUpdated) => {
        if (err) return res.status(500).send({
            message: 'there is been an error in the request'
        })
        return res.status(200).send({
           messages:messageUpdated
       })
    })
}
module.exports = {
    test,
    saveMessage,
    getReceivedMessages,
    getEmmitedMessages,
    getUnviewedMessages,
    markedAsRead
}