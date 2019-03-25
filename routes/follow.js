'use strict'
var express = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);//*to follow someone
api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);//!delete a  follow
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);//? getting who is following me
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);//? paginated method to get all my followers also by id
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows);//?non paginated method to get all my followers

module.exports = api;
