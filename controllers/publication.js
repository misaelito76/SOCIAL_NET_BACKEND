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
                message: 'error giving baack the publications'
            });
            if (!publications) return res.status(404).send({
                message: 'there is no publications'
            });
                var follows_clean = [];
                publications.forEach((publication) => {
                    follows_clean.push(publication.user)
                });
                
            return res.status(200).send({
                Total_items: total,
                Pages: Math.ceil(total / itemsPerPage),
                Page:page,
                Publications:publications
            })
            
        });
    
    })
};
function getPublication(req, res) {
          var publicationId = req.params.id          
    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({
            message: 'error giving baack the publication'
        }); 
        if (!publication) return res.status(404).send({
            message: 'there is no publication'
        });
        return res.status(200).send({publication})

    })
};
function deletePublication(req, res) {
    var publicationId = req.params.id          
    Publication.find({ 'user': req.user.sub,'_id':publicationId }).remove ((err, publicationRemoved) => {
  if (err) return res.status(500).send({
      message: 'error removing the publication'
  }); 
  if (!publicationRemoved) return res.status(404).send({
      message: ' publication is still there'
  });
  return res.status(200).send({publicationRemoved})

})
}

function uploadImage(req, res) {
    var publicationId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
       
        if (file_ext == 'jpg' ||
            file_ext == 'png' ||
            file_ext == 'jpeg' ||
            file_ext == 'gif') {
            //*update doc of logged user

            Publication.findByIdAndUpdate(publicationId, {
                file: file_name
            }, {
                new: true
            }, (err, publicationUpdated) => {
                if (err) return res.status(404).send({
                    message: 'request error'
                });
                if (!publicationUpdated) return res.status(500).send({
                    message: 'update error'
                });
                return res.status(200).send({
                    user: publicationUpdated
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
    var path_file = './uploads/publications/' + image_file;
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

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            message: message
        });

    });
};

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/' + image_file;
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
    test,
    savePublication,//* line 20
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}