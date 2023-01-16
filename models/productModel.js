const mongoose = require('mongoose');
const Category = require("./categoryModel");

const productSchema = mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    richDescription:{type:String,default:''},
    image:{type:String,default: ''},
    images:[
    {
        type:String
    }
    ] ,
    brand:{type:String,default:''},
    price:{type:Number,default:0},
    category:{type:mongoose.Schema.Types.ObjectId,ref:'Category'},
    countlnStock:{type:Number,min:0,max:500,required: true},
    rating:{type:Number,default:0},
    numReviews:{type:Number,default:0},
    isFeatured:{type:Boolean,default:false},
    dateCreated:{type:Date,default:Date.now}
});

module.exports = mongoose.model('Product',productSchema);





