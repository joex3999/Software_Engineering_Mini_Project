	var express = require('express');

	var app = express();
	var mongo = require('mongodb').MongoClient;

	var url = 'mongodb://localhost:27017/tutorial';
	var passport = require("passport");
	app.use(express.static(__dirname+"/public")); 
	var path = require('path');
	var mainController = require('./controllers/mainController');
	var router = express.Router();
	var User = require('../../app/models/user');
	var Portfolio = require('../../app/models/portoflio');
	var Work =require('../../app/models/work');
	
	
	var multer  = require('multer')
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'public/uploads/');
		},
		filename: function (req, file, cb) {

			cb(null, Date.now()  + path.extname(file.originalname));
		}
	});


	const upload = multer({
		storage: storage
	});






	module.exports = function(router) {






		function ensureAuthenticated(req, res, next) {
			if (req.isAuthenticated()) {
				next();
			} else {
				req.flash("info", "You must be logged in to see this page.");
				res.redirect("/login");
			}
		}

		router.use(function(req, res, next) {
			res.locals.currentUser = req.user;
			res.locals.errors = req.flash("error");
			res.locals.infos = req.flash("info");
	  //console.log(req.user);
	  next();
	});

		router.get('/viewall',function(req,res){
			Portfolio.find(function(err,portfolios){
				if(err)
					res.send(err.message);
				else{

					var pageSize = 10 ;
					if(req.query.page){
						var currentPage = req.query.page;}else{
							var currentPage = 1;
						}
						var pageCount = Math.ceil(portfolios.length/pageSize);
						console.log(pageCount);
						console.log(currentPage);
						res.render('allwork',{portfolios,pageCount,currentPage,pageSize});
					}
				})
		});


		router.post('/addportfolio',upload.single('pp'),function(req,res,next){
			


			if((req.body.details||req.body.url)){
				
				var portfolio = new Portfolio();
				var image = req.file;
				portfolio.name = req.body.name;
				portfolio.username = res.locals.currentUser.username;
				
				if(req.file)
					portfolio.profilePicture = image.path;


				portfolio.save(function(err){	
					if(err)

						return err ;
				});


				if(req.body.details){
					
					var work = new Work();
					work.pid = portfolio._id;
					work.details = req.body.details;
					work.type = 1 ;
					work.save();}

					if(req.body.url){
						var work2 = new Work();
						work2.pid = portfolio._id;
						work2.details = req.body.url;
						work2.type = 2;
						work2.save();
					}


					var variab = false ;
					var message = "You filled a portfolio successfully :D";
					res.render("errorpage.ejs",{variab,message});
				}
				else{
					var variab = true ;
					res.render("addPortfolio.ejs",{variab});
				}




			});


		router.get('/',function(req,res){

			res.render("index2.ejs");
		});

		router.get('/viewyw',ensureAuthenticated,function(req,res){

			Portfolio.findOne({username :res.locals.currentUser.username},function(err,portfolio){
				if(portfolio){
					var url  = portfolio.profilePicture;
					var name = portfolio.name;
					Work.find({pid:portfolio._id},function(err,works){
						var pageSize = 4;
						var pageCount = Math.ceil(works.length/pageSize); 
						if(req.query.page){
						var currentPage = req.query.page;}else{
							var currentPage = 1;
						}
					
				
						res.render("yourwork.ejs",{url,name,works,pageSize,pageCount,currentPage});
					});
				}else{
					var variab = true ;
					var message = "You dont have a portfolio yet . please fill one in";
					res.render("errorpage.ejs",{variab,message});
				}
			});
			

		});
		router.get('/addwork',ensureAuthenticated,function(req,res){
			Portfolio.findOne({username:res.locals.currentUser.username},function(err,portfolio){
				if(portfolio){
					res.render("addwork.ejs");
				}
				else{
					var variab = true ;
					var message = "You dont have a portfolio yet . please fill one in";
					res.render("errorpage.ejs",{variab,message});
				}
			});
			
		});
		router.get('/addportfolio',ensureAuthenticated,function(req,res){
			Portfolio.findOne({username :res.locals.currentUser.username},function(err,user){
				if(user){
					var variab = true ;
					var message = "You already have a portfolio";
					res.render("errorpage.ejs",{variab,message});
				}else{

					var variab = false ;
					res.render("addPortfolio.ejs",{variab});

				}


			});
		});







		router.post('/addwork',upload.single("image"),ensureAuthenticated,function(req,res) {
			if(!req.file&&!req.body.url&&!req.body.details){
				var variab = true ;
				var message = "Please enter any input ";
				res.render("errorpage.ejs",{variab,message});
			}else{

				Portfolio.findOne({username:res.locals.currentUser.username},function(err,portfolio){

					if(req.file){
						var work = new Work();
						work.pid = portfolio._id;
						work.details = req.file.path;
						console.log(1 +" " +work.details);
						work.type = 3;
						work.save();
					}
					if(req.body.url){
						var work = new Work();
						work.pid = portfolio._id;
						work.details = req.body.url;
						console.log(2 +" " +work.details);
						work.type = 2;
						work.save();
					}
					if(req.body.details){
						var work = new Work();
						work.pid = portfolio._id;
						work.details = req.body.details;
						console.log(3 + " " +work.details);
						work.type = 1;
						work.save();
					}
					var variab = false ;
					var message = "Work entered successfully ";
					res.render("errorpage.ejs",{variab,message});
				});



			}});
		router.get('/about',function(req,res){

				res.render(path.join('about.ejs')); // this is basically saying take the current directory and add to it by using path .join the following directory

			});

		router.post('/register',mainController.Register);
		router.get('/register',function(req,res){
			var variab = false ;
			var message = ""
				res.render(path.join('register.ejs'),{variab,message}); // this is basically saying take the current directory and add to it by using path .join the following directory

			});
		
		router.get('/viewwork/:username',function(req,res){

			var username = req.param("username");

			Portfolio.findOne({username :username},function(err,portfolio){
				if(portfolio){
					var url  = portfolio.profilePicture;
					var name =  portfolio.name;
					Work.find({pid:portfolio._id},function(err,works){
							var pageSize = 4;
						var pageCount = Math.ceil(works.length/pageSize); 
						if(req.query.page){
						var currentPage = req.query.page;}else{
							var currentPage = 1;
						}
					

						res.render("indivWork.ejs",{username,name,url,works,pageSize,pageCount,currentPage});
					});
				}else{
					var variab = true ;
					var message = "Error Occured !.";
					res.render("errorpage.ejs",{variab,message});
				}
			});

		});


		router.get('/login',function(req,res){
			
			var variab = false ;
			var errors = res.locals.errors;


			res.render('login.ejs',{variab,errors,});
		});


		router.get('/logout',function(req,res){
			req.logout();

			var variab = false ;
			var message = "you logged out successfully . Please come again ! :D ";
			res.render("errorpage.ejs",{variab,message});
			
		})

		router.post("/login", passport.authenticate("login", {
			successRedirect: "/",
			failureRedirect: "/login",
			failureFlash: true
		}));


		router.get("*",function(req,res){

			res.render("index2.ejs");
		});
		return router ;
	}