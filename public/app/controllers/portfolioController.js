//Dependencies && Configuration
var express = require('express');
var validator = require('validator');
var app = express();
var path = require('path');
app.use(express.static(__dirname + "/public")); // this means that everything in the directory x is gonna be available in the front end


//Schemas
var User = require('../../../app/models/user.js');
var Portfolio = require('../../../app/models/portoflio');
var Work = require('../../../app/models/work');

let portfolioController = {

    viewPortfolios: function(req, res) {
        Portfolio.find(function(err, portfolios) {
            if (err)
                res.send(err.message);
            else {

                var pageSize = 10;
                if (req.query.page) {
                    var currentPage = req.query.page;
                } else {
                    var currentPage = 1;
                }
                var pageCount = Math.ceil(portfolios.length / pageSize);
                console.log(pageCount);
                console.log(currentPage);
                res.render('allwork', {
                    portfolios,
                    pageCount,
                    currentPage,
                    pageSize
                });
            }
        })
    },
    addPortfolio: function(req, res, next) {


        if (req.body.name) {
            if ((req.body.details || req.body.url)) {
                var portfolio = new Portfolio();
                var image = req.file;
                portfolio.name = req.body.name;
                portfolio.username = res.locals.currentUser.username;

                if (req.file) {
                    portfolio.profilePicture = image.path;
                } else {
                    portfolio.profilePicture = "public/uploads/defaultpp.jpg";
                }
                portfolio.save(function(err) {
                    if (err)

                        return err;
                });

                if (req.body.details) {

                    var work = new Work();
                    work.pid = portfolio._id;
                    work.details = req.body.details;
                    work.type = 1;
                    work.save();
                }

                if (req.body.url) {
                    var work2 = new Work();
                    work2.pid = portfolio._id;
                    work2.details = req.body.url;
                    work2.type = 2;
                    work2.save();
                }
                var variab = false;
                var message = "You filled a portfolio successfully :D";
                res.render("errorpage.ejs", {
                    variab,
                    message
                });
            } else {
                var variab = true;
                var message = "you have to insert at least 1 work";
                res.render("addPortfolio.ejs", {
                    variab,
                    message
                });
            }
        } else {
            var variab = true;
            var message = "Please insert your name";
            res.render("addPortfolio.ejs", {
                variab,
                message
            });
        }
    },
    makePortfolio: function(req, res) {
        Portfolio.findOne({
            username: res.locals.currentUser.username
        }, function(err, user) {
            if (user) {
                var variab = true;
                var message = "You already have a portfolio";
                res.render("errorpage.ejs", {
                    variab,
                    message
                });
            } else {

                var variab = false;

                res.render("addPortfolio.ejs", {
                    variab
                });

            }


        });
    }


}

module.exports = portfolioController;
