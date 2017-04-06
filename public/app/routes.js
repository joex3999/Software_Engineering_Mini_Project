//Configuration
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/tutorial';
var passport = require("passport");
app.use(express.static(__dirname + "/public"));
var path = require('path');
var multer = require('multer')
//Router
var router = express.Router();

//Schemas
var User = require('../../app/models/user');
var Portfolio = require('../../app/models/portoflio');
var Work = require('../../app/models/work');

//Controllers
var registerController = require('./controllers/registerController');
var portfolioController = require('./controllers/portfolioController');
var	userController = require('./controllers/userController');
var	workController = require('./controllers/workController');

// multer  Storage Configuration
const storage = multer.diskStorage({
	    destination: function(req, file, cb) {
	        cb(null, 'public/uploads/');
	    },
	    filename: function(req, file, cb) {
	        cb(null, Date.now() + path.extname(file.originalname));
	 		}
	});

	//Multer Upload Configuraton
	const upload = multer({
	    storage: storage,
	    fileFilter: function(req, file, callback) {
	        var ext = path.extname(file.originalname);
	        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
	            return callback(new Error('Only images are allowed'))
	        }
	        callback(null, true)
	    }
	});

//Main Router
module.exports = function(router) {

	    function ensureAuthenticated(req, res, next) {
	        if (req.isAuthenticated()) {
	            next();
	        } else {
	            req.flash("info", "You must be logged in to see this page.");
	            res.redirect("/login");
	        }
	    };
	    router.use(function(req, res, next) {
	        res.locals.currentUser = req.user;
	        res.locals.errors = req.flash("error");
	        res.locals.infos = req.flash("info");
	        //console.log(req.user);
	        next();
	    });

			//Portfolio Requests
	    router.get( '/viewall',portfolioController.viewPortfolios);
	    router.post('/addportfolio', upload.single('pp'), portfolioController.addPortfolio);
			router.get('/addportfolio', ensureAuthenticated, portfolioController.makePortfolio);



	    //Work Requests
	    router.get('/delete/:_id',workController.deleteWork);
    	router.post('/update', workController.updateWork);
			router.post('/ppupdate', upload.single('pp'), workController.updateProfilePicture);
			router.post('/ppdelete',workController.deleteProfilePicture);
		 	router.post('/addwork', upload.single("image"), ensureAuthenticated, workController.addWork);

			//Register Requests
			router.get('/register', registerController.getRegister);
			router.post('/register', registerController.Register);

			//User Requests
			router.get('/', userController.home);
			router.get('/viewyw', ensureAuthenticated, userController.viewYourWork);
			router.get('/addwork', ensureAuthenticated, userController.addWork);
			router.get('/about',userController.about);
			router.get('/viewwork/:username', userController.viewOnesWork);
			router.get('/login', userController.login);
			router.get('/logout',userController.logout);
			router.post("/login",userController.passportAuth);
			//Any Other routes
      router.get("*",userController.home);

			//Returning Router
	    return router;
	}
