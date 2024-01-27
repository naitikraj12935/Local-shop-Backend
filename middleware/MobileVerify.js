const User=require('../Models/Usermodel');
const twilio = require('twilio');
const {generateRefreshTokenAndAccessToken}=require('../controller/Signup')
const MobileVerify=async(req,res,next)=>{
    try {
        const {mobileNumber}=req.body;
        const user=await User.find({mobileNumber:mobileNumber});
        if(!user)
        {
            res.status(404).json({
                status:'fail',
                msg:'their is any athorized user with this Mobile Number'
            })
        }
        next();
        
    } catch (error) {
        res.status(500).json({
            status:'fail',
            msg:'server error  please login or try again after some time'
        })
    }
}

const accountSid='AC8a9dfb5d9fda6a6b52ec7ff1bce2aed2';
const authToken='3ff75c3013497ae81f30d3aa042d542d';

const client = new twilio(accountSid, authToken);

const OtpGenerate=(req, res) => {
  const { mobileNumber } = req.body;

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Message to be sent
  const message = `Your OTP is: ${otp}`;

  client.messages
    .create({
      body: message,
      from: '+13238638910',
      to: '+91'+mobileNumber,
    })
    .then(() => {
      res.status(200).json({ success: true, msg: 'OTP sent successfully.' ,Otp:otp});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, msg: 'Failed to send OTP.' });
    });
};
const GetUserbyMobile=async(req,res)=>{
    try {
        const {mobileNumber}=req.body;
        const user=await User.findOne({mobileNumber:mobileNumber});
        if(!user)
        {
            res.status(404).json({
                status:'fail',
                msg:'their is any athorized user with this Mobile Number'
            })
        }
        const accessToken=await generateRefreshTokenAndAccessToken(user);
    console.log('i am there')

    const updatedUser = await User.findById(user._id).select("-password -confirmPassword");

    console.log(updatedUser); // Log the retrieved user to check its fields
    

    const options2 = {
       httpOnly:true,
      secure: true,
      sameSite: 'None',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
   
      
    };
    const options1={
      httpOnly:true,
      secure: true,
      sameSite: 'None',
      expires: new Date(Date.now() + 1*24*60* 60 * 1000)
    }

    return res.status(200).cookie("accessToken",accessToken,options1).cookie("refreshToken",updatedUser.RefreshToken,options2).json({
      status:'ok',
      loginUser:{updatedUser,accessToken}
    })

    } catch (error) {
        res.status(500).json({
            status:'fail',
            msg:'server error  please login or try again after some time'
        })
    }
}





module.exports={MobileVerify,OtpGenerate,GetUserbyMobile};