var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs");

var adminSchema = new mongoose.Schema({
    username: {type:String,required:true},
    password:{type:String,required:true}
});
adminSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null)
};

module.exports = mongoose.model("Admin",adminSchema);