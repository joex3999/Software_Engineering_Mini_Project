
var User = require("../models/user");

module.exports = function(router) {


	router.post('/users',function(req,res){
	var user = new User();
	console.log("2y 7aga ");
	user.username = req.body.username;
	user.password = req.body.password;
	user.email = req.body.email; 

	if(req.body.username==null || req.body.email==null||req.body.password==null||req.body.username=='' || req.body.email==''||req.body.password==''){
			
			res.json({success:false  ,message:"insure inputs are provided"});
	}else{
		user.save(function(err){
		if(err){
			res.json({success:false  ,message:"username or email are already in USe !"});
		}else{
		res.json({success:true  ,message:"user Created!"});	
		}
	});
	}
	
	
});
return router ;
}