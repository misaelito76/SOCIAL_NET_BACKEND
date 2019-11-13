'use strict'
var express = require('express');
var LikeController = require('../controllers/like');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/like', md_auth.ensureAuth, LikeController.saveLike);//*to follow someone
api.delete('/like/:id', md_auth.ensureAuth, LikeController.deleteLike);//!delete a  follow
api.get('/liking/:id?/:page?', md_auth.ensureAuth, LikeController.getLikingUsers);//? getting who is following me
api.get('/liked/:id?/:page?', md_auth.ensureAuth, LikeController.getLikedUsers);//? paginated method to get all my followers also by id
api.get('/get-my-likes/:liked?', md_auth.ensureAuth, LikeController.getMyLikes);//?non paginated method to get all my followers

module.exports = api;
