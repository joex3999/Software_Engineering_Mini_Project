//Dependencies
var express = require('express');
var validator = require('validator');
var User = require('../../../app/models/user.js');
//Configuration
var app = express();
var path = require('path');
app.use(express.static(__dirname + "/public")); // this means that everything in the directory x is gonna be available in the front end

//Regular Exprestion
var Regex = require("regex");
var exp = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;&quot;:;'?/&gt;.&lt;,]).*$/;

let registerController = {



    Register: function(req, res, next) {
        var userM = new User();
        userM.username = req.body.username;
        userM.password = req.body.password;
        userM.email = req.body.email;

        if (req.body.username == null || req.body.email == null || req.body.password == null || req.body.username == '' || req.body.email == '' || req.body.password == '') {
            var variab = true;
            var message = "Please enter all fields "
            res.render('register.ejs', {
                variab,
                message
            });
        } else {
            User.findOne({
                username: userM.username
            }, function(err, user) {
                if (user) {
                    var variab = true;
                    var message = "username is already in use ";
                    res.render("register.ejs", {
                        variab,
                        message
                    });
                } else {
                    User.findOne({
                        email: userM.email
                    }, function(err, user) {
                        if (user) {
                            var variab = true;
                            var message = "email is already in use ";
                            res.render("register.ejs", {
                                variab,
                                message
                            });
                        } else {
                            if (req.body.password.match(exp)) {
                                console.log("true");
                                if (validator.isEmail(req.body.email)) {
                                    userM.save(function(err) {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            var variab = false;
                                            var message = "User successfully Registered ! ";
                                            res.render("errorpage.ejs", {
                                                variab,
                                                message
                                            });
                                        }
                                    });
                                } else {
                                    var variab = true;
                                    var message = "Please enter a valid email ";
                                    res.render("register.ejs", {
                                        variab,
                                        message
                                    });
                                }
                            } else {
                                var variab = true;
                                var message = " The password must include 8 characters at least including a digit ,a special character,1 small-case letter ,and 1 capital letter";
                                res.render("register.ejs", {
                                    variab,
                                    message
                                });
                            }
                        }
                    });
                }
            });
        }
    },

    getRegister: function(req, res) {
        var variab = false;
        var message = "s"
        console.log("ok");
        res.render(path.join('register.ejs'), {
            variab,
            message
        }); // this is basically saying take the current directory and add to it by using path .join the following directory

    }




}

module.exports = registerController;
