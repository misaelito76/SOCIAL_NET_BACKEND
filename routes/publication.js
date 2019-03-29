'use strict'
//*libraries
var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();//*Here we load Router method
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');// uploading middleware
var md_upload = multipart({  uploadDir: './uploads/publications' });
//*************** */Routes***********************************
api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload ],  PublicationController.uploadImage);

api.get('/testing', md_auth.ensureAuth, PublicationController.test);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

api.delete('/publication-removal/:id', md_auth.ensureAuth, PublicationController.deletePublication);


module.exports = api;//*giving back the api object with the new info we bind here
//*in this express route
