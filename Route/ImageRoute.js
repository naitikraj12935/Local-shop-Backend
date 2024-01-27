const express=require('express');
const ImageRouter=express.Router();
const upload=require('../utils/Uploadfiles')
const uploadfile=require('../controller/image.controller')

ImageRouter
 .route('/file/upload')
 .post(upload.single('file'),uploadfile);



 module.exports=ImageRouter