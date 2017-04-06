var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new Schema({
  username : { type :String ,lowercase:true ,required :true ,unqiue : true },// user validation
  password : {type : String , required:true },
  email: {type : String , required:true ,lowercase:true,unique:true},
  screenshot : {type : String , required:false },
  link: {type:String,required:false},
  repo : {type:String,required:false}
});




UserSchema.pre('save', function(next) {// before saving The User this schema will be executed
  var user = this ;
  bcrypt.hash(user.password,null,null,function(err,hash){
    if(err)
      return next(err); // jump to next
    user.password = hash ;
    next();
  });

});

UserSchema.methods.comparePassword = function(password){

  return  bcrypt.compareSync(password,this.password);
};
UserSchema.methods.changeLink = function(link){
  this.link = link ;
 return ;
}


UserSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var userss=module.exports=mongoose.model('User',UserSchema);
