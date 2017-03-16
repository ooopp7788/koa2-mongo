const mongoose  = require('mongoose');

// Schema模型
const UserSchema = new mongoose.Schema({
    name : String,
    password : String
});

UserSchema.pre('save', function(next){
  var now = new Date();
  this.update_at = now;
  next();
});

mongoose.model('User',UserSchema)
