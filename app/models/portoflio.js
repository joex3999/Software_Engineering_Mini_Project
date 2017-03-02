var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PortfolioSchema = new Schema({
  username : { type :String ,lowercase:true ,required :true ,unique : true },
  name:{type:String,lowercase:true,required:true},
  profilePicture : {type : String }
  




  
});     



module.exports=mongoose.model('Portfolio',PortfolioSchema ); 