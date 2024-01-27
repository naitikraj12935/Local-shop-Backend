const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        minlength:[4,'enter name of atleast 4 letter'],
        maxlength:[25,'enter name of atmost 25 letter'],
        required:[true,'enter your name']
    },
    email:{
        type:String,
        maxlength:[100,'enter email under 100 character'],
        required:[true,'enter your email'],
        unique: [true,'this email id is already registered'],
        validate:{
            validator:validator.isEmail,
            message: '{VALUE} is not a valid email'
        } 
    },
    mobileNumber: {
      type: String,
      maxlength: [15, 'Enter a valid mobile number'],
      required: [true, 'Enter your mobile number'],
      unique: [true, 'This mobile number is already registered'],
      validate: {
        validator: function (value) {
          // Basic mobile number validation
          // You can use additional validation logic or a library like validator for this
          return /^[0-9]{10,15}$/.test(value); // Validate using regex for numbers between 10 and 15 digits
        },
        message: 'Please enter a valid mobile number',
      },
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // Minimum length for the password
      },
      confirmPassword: {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            // Validate that confirmPassword matches the password field
            return value === this.password;
          },
          message: 'Passwords do not match',
        },
      },
      deliveryAddress:{
        type:String,
        required:true,
        minlength:10
      },
      RefreshToken:{
        type:String
      }
})
userSchema.pre('save',async function(next){
  try{

  
     if(!this.isModified('password'))
     {
      return next();
     }
     const passworddecrypt=await bcrypt.hash(this.password,10);
     this.password=passworddecrypt;
     this.confirmPassword=''
     return next()
    } catch(error){
      return next(error)
    }
})

userSchema.methods.ComparePassword=async function(candidatepassword)
{
  return bcrypt.compare(candidatepassword,this.password);
}

userSchema.methods.generateRefreshToken=function(){
  return jwt.sign({
    _id:this._id,
    name:this.name,
    mobileNumber:this.mobileNumber,
    email:this.email,
    deliveryAddress:this.deliveryAddress
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:"7d",
  }
  )
}

userSchema.methods.generateAccessToken=function(){
  return jwt.sign(
    {
      _id:this._id,
      name:this.name,
      mobileNumber:this.mobileNumber,
      email:this.email,
      deliveryAddress:this.deliveryAddress
    }
  ,
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn:"1d",
  }
  )
}

const User=mongoose.model('User',userSchema);
module.exports=User;