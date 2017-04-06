//Dependencies
var express = require('express');
var validator = require('validator');
var User = require('../../../app/models/user.js');
//Configuration
var app = express();
var path = require('path');
app.use(express.static(__dirname + "/public")); // this means that everything in the directory x is gonna be available in the front end

//Schemas
var User = require('../../../app/models/user.js');
var Portfolio = require('../../../app/models/portoflio');
var Work = require('../../../app/models/work');
let workController = {
    addWork: function(req, res) {
        if (!req.file && !req.body.url && !req.body.details) {
            var variab = true;
            var message = "Please enter any input ";
            res.render("errorpage.ejs", {
                variab,
                message
            });
        } else {
            Portfolio.findOne({
                username: res.locals.currentUser.username
            }, function(err, portfolio) {
                if (req.file) {
                    var work = new Work();
                    work.pid = portfolio._id;
                    work.details = req.file.path;
                    work.type = 3;
                    work.save();
                }
                if (req.body.url) {
                    var work = new Work();
                    work.pid = portfolio._id;
                    work.details = req.body.url;
                    work.type = 2;
                    work.save();
                }
                if (req.body.details) {
                    var work = new Work();
                    work.pid = portfolio._id;
                    work.details = req.body.details;
                    work.type = 1;
                    work.save();
                }
                var variab = false;
                var message = "Work entered successfully ";
                res.render("errorpage.ejs", {
                    variab,
                    message
                });
            });



        }
    },


    deleteWork: function(req, res) {
        console.log(req.param("_id"))
        Work.findOneAndRemove({
            _id: req.param("_id")
        }, function(err, res) {
            if (err)
                console.log(err);
        });

        res.redirect(req.get('referer'));

    },

    updateWork: function(req, res) {
        Work.findOneAndUpdate({
            _id: req.param("_id")
        }, {
            details: req.body.texty
        }, function(err, res) {
            if (err)
                console.log(err);

        });
        res.redirect(req.get('referer')); // to simply refresh
    },

    updateProfilePicture: function(req, res) {

        console.log("pass");
        var image = req.file;
        if (image) {
            Portfolio.findOneAndUpdate({
                _id: req.query.id
            }, {
                profilePicture: image.path
            }, function(err, res) {
                if (err)
                    return err;


            });
        }
        res.redirect(req.get('referer'));
    },

    deleteProfilePicture: function(req, res) {
        Portfolio.findOneAndUpdate({
            _id: req.query.id
        }, {
            profilePicture: "public/uploads/defaultpp.jpg"
        }, function(err, res) {
            if (err)
                return err;
        });
        res.redirect(req.get('referer'));
    }
}

module.exports = workController;
