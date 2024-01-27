const mongoose = require('mongoose');
const User=require('./Usermodel')
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        minlength: 4,
        required: [true, 'Enter product name']
    },
    productCategory: {
        type: String,
        required: [true, 'Enter category']
    },
    Price:{
          type:Number,
          required:[true,'enter price']
    },
    stock: {
        type: Number,
        required: [true, 'Enter stock quantity'],
        default: 0
    },
    description: {
        type: String,
        minlength: 10,
        required: [true, 'Enter description']
    },
    warranty: { // Corrected typo from "waranty" to "warranty"
        type: Number,
        
        default: 0
    },
    guarantee: {
        type: Number,
       
        default: 0
    },
    productImage1: 
        {
            type: String,
            required: true
        }
        ,
        productImage2:{
              type:String
        },
        Offer:{
            type:Number,
            default:0
        },
    
    createdBy: { // Corrected typo from "Createdby" to "createdBy"
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema); // Corrected from mongoose.Model to mongoose.model

module.exports = Product;
