'use strict'
 //!routes creates an url for every method in the API
var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');// uploading middleware
var md_upload = multipart({  uploadDir: './uploads/users' });
//*get methods
api.get('/home', UserController.home);
api.get('/test', md_auth.ensureAuth, UserController.test);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.get('/get-image-user/:imageFile',UserController.getImageFile);
api.get('/counters/:id?',md_auth.ensureAuth, UserController.getCounters);

//*post methods
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth,md_upload ], UserController.uploadImage);
//put method
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;
