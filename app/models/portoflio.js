var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PortfolioSchema = new Schema({
  username : { type :String ,lowercase:true ,required :true ,unique : true },
  profilePicture : {type : String , required:true }
  




  
});     



module.exports=mongoose.model('Portfolio',PortfolioSchema ); 