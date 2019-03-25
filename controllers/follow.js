'use strict'
//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Follow = require('../models/follow');
var fs = require('fs');
var path = require('path');
function saveFollow(req, res) {
    var params = req.body;
    var follow = new Follow();
    follow.user = req.user.sub; //*follow.user save the value of the authenticated user
    follow.followed = params.followed;
    follow.save((err, followStored) => {
        if (err) return res.status(500).send({
            message: 'error trying to save the follow'
        });
        if (!followStored) return res.status(400).send({
            message: 'the follow was not saved'
        });
        return res.status(200).send({
            follow: followStored
        })
    })

};

function deleteFollow(req, res) {
    var userId = req.user.sub; //*logged user
    var followId = req.params.id; //*user we are  going to un follow
    Follow.find({
        'user': userId,
        'followed': followId
    }).remove(err => {
        if (!followId) return res.status(500).send({
            message: 'error trying to save the follow'
        });
        return res.status(200).send({
            message: 'you are not following this user anymore'
        })
    })
};

function getFollowingUsers(req, res) {
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
    var itemsPerPage = 4;
    Follow.find({
        user: userId
    }).populate({
        path: 'followed'
    }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({
            message: 'server error'
        });
        if (!follows) return res.status(404).send({
            message: 'you are not following any user'
        });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        })
    });

};
//!method to get my follows/who follows me list with no pagination
function getFollowedUsers (req, res) {
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
    var itemsPerPage = 4;
    Follow.find({
        followed: userId//users following me
    }).populate( 'user').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({
            message: 'server error'
        });
        if (!follows) return res.status(404).send({
            message: 'you are not followed by  any user'
        });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        })
    });

};
function getMyFollows(req, res) {
    var userId = req.user.sub;
    var find = Follow.find({ user: userId });//*users i follow
    if (req.params.followed) {
        find = Follow.find({ followed: userId });//*users following me.
    }
    find.populate( 'user followed').exec( (err, follows) => {
        if (err) return res.status(500).send({
            message: 'server error'
        });
        if (!follows) return res.status(404).send({
            message: 'you are not followed by  any user'
        });
        return res.status(200).send({
         
            follows
        })
    });

}
module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}