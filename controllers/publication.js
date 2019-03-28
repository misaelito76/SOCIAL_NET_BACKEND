'use strict'
//*****************/libraries*********************
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

//************** */Models***************************
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

//*****************Methods********************* */
function test(req, res) {
    res.status(200).send({
        message: 'Hola asere'
    })
};
//********************Method to save a publication**************** */
function savePublication(req, res) {
    var params = req.body; //*what we get from post requests
    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({
            message: 'Error trying to save the publication'
        });
        if(!publicationStored)return res.status(500).send({
            message: 'Error trying to store the publication'
    })
        return res.status(200).send({
           publication: publicationStored
})
    });
};
function getPublications(req, res) {
    var identity_user_id = req.user.sub;
    var userId = req.params.id;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    };


    
    var itemsPerPage = 4;
    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({
            message: 'error giving baack the following'
        });
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed)
        });
        //*the operator "$in" search all document which users is contained in a publication inside the array follows_clean  
        Publication.find({ 'user': { "$in": follows_clean } }).sort('-created_at').populate('user')
            .paginate(page, itemsPerPage, (err, publications, total) => {
                

            if (err) return res.status(500).send({
                message: 'error giving baack the publication'
            });
            if (!publications) return res.status(404).send({
                message: 'there is no publication'
            });
                var follows_clean = [];
                publications.forEach((publication) => {
                    follows_clean.push(publication.user)
                })
            return res.status(200).send({
                Total_items: total,
                Pages: Math.ceil(total / itemsPerPage),
                Page:page,
                Publications:publications
            })
            
        });
    
    })
}       

module.exports = {
    test,
    savePublication,//* line 20
    getPublications
}