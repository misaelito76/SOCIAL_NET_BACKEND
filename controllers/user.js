'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication')
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

function home(req, res) {
    console.log(req.body)
    res.status(200).send({
        message: 'Hello world home'

    })
};
//*test method
function test(req, res) {
    console.log(req.body)
    res.status(200).send({
        message: 'Hello world test'

    })
};
//*save user
function saveUser(req, res) {
    var params = req.body;
    var user = new User();
    if (params.name && params.surname &&
        params.nick && params.email &&
        params.password) {

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        //*control duplicated users
        User.find({
            $or: [{
                    email: user.email
                },
                {
                    nick: user.nick
                },

            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({
                message: 'error at users request'
            });
            if (users && users.length >= 1) {
                return res.status(200).send({
                    message: 'the user already'
                })
            } else {
                //*encrypt password and save data
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash; //asignacion es a lo q esta antes del =
                    user.save((err, userStored) => {
                        if (err)
                            return res.status(500).send({
                                message: 'user not saved'
                            });
                        if (userStored) {
                            res.status(200).send({
                                user: userStored
                            });
                        } else {
                            res.status(404).send({
                                message: 'user not registered'
                            });
                        };

                    });

                });

            }
        });



    } else {
        res.status(200).send({
            message: 'fill the form!!'
        });
    }
}
//login
function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({
        email: email
    }, (err, user) => {

        if (err) return res.status(500).send({
            message: "request denied"
        });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {

                    if (params.getToken) {
                        return res.status(200).send({
                            token: jwt.createToken(user) //*calling jwt service with 
                            //*the method createtoken we then pass the "user"
                        })
                    } else {
                        user.password = undefined; // *not showing password in the db
                        return res.status(200).send({
                            user
                        });
                    }
                } else {
                    return res.status(404).send({
                        message: 'user not identified!'
                    })
                }
            });
        } else {
            return res.status(404).send({
                message: 'user not identified!....yet'
            });

        }
    });
};
//*data using req.params is from URL...req.body is from put and get 

//**************** */data from one user*************************************

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({
            message: 'request error'
        });
        if (!user) return res.status(404).send({
            message: 'he probably died'
        });
        followThisUser(req.user.sub, userId).then((value) => {
            return res.status(200).send({
                user,
                "Following": value.following,
                 "Followed":value.followed
            });
        })
    });
};

async function followThisUser(identity_user_id, user_id) {
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {
        console.log(follow);
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
 
    return {
        following: following,
        followed: followed
    }
}

function getUsers(req, res) {
    var identity_user_id = req.user.sub; //* sub is the logged user's ID
    var page = 1;
    if (req.params.page) {

        page = req.params.page;

    }
    var itemsPerPage = 4;
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({
            message: 'request error'
        });
        if (!users) return res.status(404).send({
            message: 'no users available'
        });
        //*calling the function to print the following and followed users as well as the whole API
        followUserIds(identity_user_id).then((value) => {
            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me:value.followed,
                total,
                pages: Math.ceil(total / itemsPerPage)
            })  
        })
      
    })
};
//************************************************************************************ */
//?function to obtain arrays with id's from users we follow and users following us
async function followUserIds(user_id){
    try{
        var following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0}).exec() 
            .then((follows) => {
                return follows;
            })
            .catch((err) => {
                return handleError(err);
        });
    
      var followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0}).exec()
          .then((follows) => {
              return follows;
          })
          .catch((err) => {
              return handleError(err);
      });
                
            //Procesar following Ids
                var following_clean = [];
          
                following.forEach((follow) => {
                  following_clean.push(follow.followed);
                });
     
                //Procesar followed Ids
                var followed_clean = [];
            
                followed.forEach((follow) => {
                  followed_clean.push(follow.user);
                });
                
          
            return {
                     following: following_clean,
                     followed: followed_clean
                   }
          
          } catch(e){
          console.log(e);
          }
};
function getCounters(req, res) {
    var userId = req.user.sub;
    
    if (req.params.id) {
        userId = req.params.id;
    }
        getCountFollow(req.params.id).then((value) => {
            return res.status(200).send(value);
      })
  }  

async function getCountFollow(userId) {
    var following = await Follow.count({ "user": userId }).exec().then((count) => {
        
        return count
    }).catch((err) => {
        return handleError(err)
    })
    var followed = await Follow.count({ "followed": userId }).exec().then((count) => {
    
        return count
    }).catch((err) => {
        return handleError(err)
    });
    var publications = await Publication.count({ "user": userId }).exec().then((count) => {
    
        return count
    }).catch((err) => {
        return handleError(err)
    });
    return {
        following: following,
        followed: followed,
        publications:publications
    }
}
//** ************************* *[update user]*******************************************
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    //*erase password property below for not updating it
    delete update.password;
    if (userId != req.user.sub) {
        return res.status(500).send({
            message: 'permission dennied'
        })
    }
    User.findByIdAndUpdate(userId, update, {
        new: true
    }, (err, userUpdated) => {
        if (err) return res.status(404).send({
            message: 'request error'
        });
        if (!userUpdated) return res.status(500).send({
            message: 'update error'
        });
        return res.status(200).send({
            user: userUpdated
        })
    })
}


//**********************/upload image/user avatar*********************************

function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'no permission to update ');
        };
        if (file_ext == 'jpg' ||
            file_ext == 'png' ||
            file_ext == 'jpeg' ||
            file_ext == 'gif') {
            //*update doc of logged user

            User.findByIdAndUpdate(userId, {
                image: file_name
            }, {
                new: true
            }, (err, userUpdated) => {
                if (err) return res.status(404).send({
                    message: 'request error'
                });
                if (!userUpdated) return res.status(500).send({
                    message: 'update error'
                });
                return res.status(200).send({
                    user: userUpdated
                })

            })

        } else {
            return removeFilesOfUploads(res, file_path, 'invalid extension');
        }
    } else {
        return res.status(200).send({
            message: `there's not uploads`
        })
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            message: message
        });

    });
};

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;
    console.log(image_file)

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file)); //* sendFile() is a method from express
        } else {
            res.status(200).send({
                message: 'no image to show'
            });
        }
    })
}

module.exports = {
    home,
    test,
    saveUser,   //*line 27
    loginUser,  //*line 93
    getUser,    //*line 139
    getUsers,   //*line 180
    updateUser, //*line 283
    getCounters,//*line 253
    uploadImage,//*line 311
    getImageFile//*line 365
}