const express=require('express')
const SignupRoute=express.Router();
const {signup,login, logout,Profile}=require('../controller/Signup')
const Jwtverify=require('../middleware/Jwtverify')


SignupRoute
.route('/signup')
 .post(signup)

SignupRoute
 .route('/login')
 .post(login) 

SignupRoute
 .route('/logout')
 .get(Jwtverify,logout) 

 SignupRoute
 .route('/profile')
 .post(Profile)



 module.exports=SignupRoute;