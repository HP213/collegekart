var mongoose = require('mongoose')
var orderSchema = new mongoose.Schema({
  name:{type:String,required:true},
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required: true},
  address: {type:String, required:true},
  postalCode:{type:String,required:true},
  status:{type:String,default:"pending"}
},
    {
  timestamps:true
}
);

module.exports = mongoose.model('Order',orderSchema)
