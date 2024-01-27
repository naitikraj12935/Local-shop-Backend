const express=require('express');
const VerifyRoute=express.Router();
const {VerifyAccessToken}=require('../controller/Verify.controller')

VerifyRoute
 .route('/verify/token')
 .get(VerifyAccessToken)



 module.exports=VerifyRoute;