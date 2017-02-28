var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WorkSchema = new Schema({
	pid : { type :String ,lowercase:true ,required :true },
	details : {type  :String , required:true },
	type: {type: Number}



	
});     



module.exports=mongoose.model('Work',WorkSchema); 