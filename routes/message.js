'use strict'
var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');


api.get('/test-dm', md_auth.ensureAuth, MessageController.test);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/sent-messages/:page?', md_auth.ensureAuth, MessageController.getEmmitedMessages);
api.get('/unviewed-messages/:page?', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/marked-as-read-messages/', md_auth.ensureAuth, MessageController.markedAsRead);

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
module.exports = api;