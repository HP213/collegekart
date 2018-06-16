const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique: true
    },
    content : {
        type : String,
        required : true
    },
    category:{
        type:String,
        required:true
    },
    originalPrice : {
        type: Number,
        required:true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    review:{
        type:Number,
        default: 0,
        required:true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }
    ],
    available:{
        type:Boolean,
        default:true
    },
        img: { data: Buffer, contentType: String }
},
    {
        timestamps: true
    }
    );

module.exports = mongoose.model('Product',productSchema);