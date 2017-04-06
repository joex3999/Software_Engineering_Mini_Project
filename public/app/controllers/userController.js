//Dependencies
var express = require('express');
var validator = require('validator');
var User = require('../../../app/models/user.js');
//Configuration
var app = express();
var path = require('path');
app.use(express.static(__dirname + "/public")); // this means that everything in the directory x is gonna be available in the front end
var passport = require("passport");
//Schemas
var User = require('../../../app/models/user.js');
var Portfolio = require('../../../app/models/portoflio');
var Work = require('../../../app/models/work');
let userController = {

    home: function(req, res) {

        res.render("index2.ejs");
    },
    viewYourWork: function(req, res) {

        Portfolio.findOne({
            username: res.locals.currentUser.username
        }, function(err, portfolio) {
            if (portfolio) {
                var url = portfolio.profilePicture;
                var name = portfolio.name;
                Work.find({
                    pid: portfolio._id
                }, function(err, works) {
                    var pageSize = 4;
                    var pageCount = Math.ceil(works.length / pageSize);
                    if (req.query.page) {
                        var currentPage = req.query.page;
                    } else {
                        var currentPage = 1;
                    }


                    res.render("yourwork.ejs", {
                        portfolio,
                        url,
                        name,
                        works,
                        pageSize,
                        pageCount,
                        currentPage
                    });

                });
            } else {
                var variab = true;
                var message = "You dont have a portfolio yet . please fill one in";
                res.render("errorpage.ejs", {
                    variab,
                    message
                });
            }
        });


    },

    addWork: function(req, res) {
        Portfolio.findOne({
            username: res.locals.currentUser.username
        }, function(err, portfolio) {
            if (portfolio) {
                res.render("addwork.ejs");
            } else {
                var variab = true;
                var message = "You dont have a portfolio yet . please fill one in";
                res.render("errorpage.ejs", {
                    variab,
                    message
                });
            }
        });

    },

    about: function(req, res) {
        res.render(path.join('about.ejs'));
    },


    viewOnesWork: function(req, res) {

        var username = req.param("username");

        Portfolio.findOne({
            username: username
        }, function(err, portfolio) {
            if (portfolio) {
                var url = portfolio.profilePicture;
                var name = portfolio.name;
                Work.find({
                    pid: portfolio._id
                }, function(err, works) {
                    var pageSize = 4;
                    var pageCount = Math.ceil(works.length / pageSize);
                    if (req.query.page) {
                        var currentPage = req.query.page;
                    } else {
                        var currentPage = 1;
                    }


                    res.render("indivWork.ejs", {
                        username,
                        name,
                        url,
                        works,
                        pageSize,
                        pageCount,
                        currentPage
                    });
                });
            } else {
                var variab = true;
                var message = "Error Occured !.";
                res.render("errorpage.ejs", {
                    variab,
                    message
                });
            }
        });

    },


    login: function(req, res) {

        var variab = false;
        var errors = res.locals.errors;


        res.render('login.ejs', {
            variab,
            errors,
        });
    },

    logout: function(req, res) {
        req.logout();

        var variab = false;
        var message = "you logged out successfully . Please come again ! :D ";
        res.render("errorpage.ejs", {
            variab,
            message
        });

    },

    passportAuth: passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }),
    
}

module.exports = userController;
