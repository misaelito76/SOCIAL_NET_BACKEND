'use strict'
//*libraries
var express = require('express');
var PublicationControler = require('../controllers/publication');
var api = express.Router();//*Here we load Router method
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty')//* uploads middleware
var md_upload = multipart({ uploadDir: './uploads/publications' });
//*************** */Routes***********************************
api.get('/testing', md_auth.ensureAuth, PublicationControler.test);
api.post('/publication', md_auth.ensureAuth, PublicationControler.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationControler.getPublications);



module.exports = api;//*giving back the api object with the new info we bind here
//*in this express route
