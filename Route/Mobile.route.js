const express=require('express')
const MobileRoute=express.Router();
const {MobileVerify,OtpGenerate,GetUserbyMobile}=require('../middleware/MobileVerify')
MobileRoute
.route('/sendOtp')
.post(MobileVerify,OtpGenerate)

MobileRoute
.route('/UserByMobile')
.post(GetUserbyMobile)


module.exports=MobileRoute