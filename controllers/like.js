'use strict'
//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Like = require('../models/like');
var fs = require('fs');
var path = require('path');

function saveLike(req, res) {
    var params = req.body;

    var like = new Like();
    //like.publication=params._id
    like.liked = params.liked; //*like.user save the value of the authenticated user
    like.user = req.user.sub;
    like.save((err, likeStored) => {
        if (err) return res.status(500).send(err
            
        );
        if (!likeStored) return res.status(400).send({
            message: 'the like was not saved'
        });
        return res.status(200).send({
            like: likeStored
        })
    })

};

function deleteLike(req, res) {
    var userId = req.user.sub; //*logged user
    var likeId = req.params.id; //*user we are  going to un like
    Like.find({
        'user': userId,
        'liked': likeId
    }).remove(err => {
        if (!likeId) return res.status(500).send({
            message: 'error trying to save the like'
        });
        return res.status(200).send({
            message: 'you are not likeing this user anymore'
        })
    })
};

function getLikingUsers(req, res) {
    var userId = req.user.sub; //
    if (req.params.id && req.params.page) {
        userId = req.params.id; //!if a particular user  requested via url then userId gets its value
    };
    var page = 1;
    if (req.params.page) {
        page = req.params.page; //!if a particular page is requested via url then page gets its value
    } else {
        page = req.params.id
    }
    var itemsPerPage = 90000000;
    Like.find({
        user: userId
    }).populate({
        path: 'liked'
    }).paginate(page, itemsPerPage, (err, likes, total) => {
        if (err) return res.status(500).send({
            message: 'server error'
        });
        if (!follows) return res.status(404).send({
            message: 'you are not following any user'
        });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            likes
        })
    });

};
//!method to get my follows/who follows me list with no pagination
function getLikedUsers (req, res) {
    var userId = req.user.sub;
    if (req.params.id && req.params.page) {
        userId = req.params.id; //!if a particular user  requested via url then userId gets its value
    };
    var page = 1;
    if (req.params.page) {
        page = req.params.page; //!if a particular page is requested via url then page gets its value
    } else {
        page = req.params.id
    }
    var itemsPerPage = 90000000;
    Like.find({
        liked: userId//users following me
    }).populate( 'user').paginate(page, itemsPerPage, (err, likes, total) => {
        if (err) return res.status(500).send({
            message: 'server error'
        });
        if (!likes) return res.status(404).send({
            message: 'you are not followed by  any user'
        });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            likes
        })
    });

};
function getMyLikes(req, res) {
    var userId = req.user.sub;
    var find = Like.find({ user: userId });//*users i like
    if (req.params.liked) {
        find = Like.find({ liked: userId });//*users liking me.
    }
    find.populate( 'user liked').exec( (err, likes) => {
        if (err) return res.status(500).send({
            message: 'server error'
        });
        if (!likes) return res.status(404).send({
            message: 'you are not liked by  any user'
        });
        return res.status(200).send({
         
            likes
        })
    });

}
module.exports = {
    saveLike,
    deleteLike,
    getLikingUsers,
    getLikedUsers,
    getMyLikes
}