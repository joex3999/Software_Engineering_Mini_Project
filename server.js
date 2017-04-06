//Packages
var express = require('express');
var app = express();
var port = process.env.PORT || 37999;
var morgan = require('morgan'); // Logger
var mongoose = require('mongoose'); //  mongoode is a model  used to guide MongoDB
var bodyParser = require('body-parser');
var router = express.Router();
var publicRoutes = require('./public/app/routes')(router);
var path = require('path');
var flash = require('connect-flash');
var session = require('express-session');
var User = require("./app/models/user");
var passport = require('passport');
var setUpPassport = require('./setuppassport');
var cookieParser = require("cookie-parser");
app.set('views', path.join(__dirname, './public/app/views'));
//MiddleWare
mongoose.connect('mongodb://localhost:27017/tutorial', function(err) {
    if (err) {
        console.log('not connected to the database ' + err);
    } else {
        console.log('succssfully connected to MongoDB');
    }

});


setUpPassport();

app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + "/public")); // this means that everything in the directory x is gonna be available in the front end

app.use(flash());

app.use(session({
    secret: "sTKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(publicRoutes);
app.set("view engine", "ejs");



// app.get('/home',function(req,res){
// 	res.send('hello from home ');
// })


// app.get('*',function(req,res){
// 	res.render(path.join(__dirname+'/public/app/views/index2.ejs')); // this is basically saying take the current directory and add to it by using path .join the following directory
// 	console.log("hello");
// 	//res.end();
// });
app.listen(port, function() {
    console.log("Server is running on port " + port);
});
