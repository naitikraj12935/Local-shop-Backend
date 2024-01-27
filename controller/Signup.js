const UserModel = require('../Models/Usermodel');

const signup = async (req, res, next) => {
  try {
    // Creating a new user from the request body
    const newUser = await UserModel.create(req.body);

    res.status(200).json({
      status: 'ok',
      User: newUser, // Responding with the newly created user
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
      // Duplicate email error
      res.status(400).json({
        msg:'email is already in use'
      });
    } else {
      // Other errors
      console.error(error);
      res.status(500).json({msg:'internal server error'});
    }
  }
};

const generateRefreshTokenAndAccessToken = async (user) => {
  try {
    console.log('I am here');
    console.log(user);

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    // Update the user's RefreshToken field
    user.RefreshToken = refreshToken;

    // Save the user and await the operation
    await user.save({ validateBeforeSave: false });

    return accessToken;
  } catch (error) {
    // Properly handle the error
    // You might want to log the error for debugging purposes
    console.error('Error generating tokens:', error);

    // Return an error response or rethrow the error to handle it in the caller function
    throw new Error('Server error occurred');
  }
};


const login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        msg: 'No account found. Please sign up first.',
        value: 404
      });
    }

    const isPasswordValid = await user.ComparePassword(password);
   

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        msg: 'Invalid password',
        value: 401
      });
    }

    const accessToken=await generateRefreshTokenAndAccessToken(user);
    console.log('i am there')

    const updatedUser = await UserModel.findById(user._id).select("-password -confirmPassword");

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
    return res.status(500).json({
      status: 'fail',
      msg: 'Server error',
      value: 500
    });
  }
};

const logout=async (req,res)=>{
  try {
     await UserModel.findByIdAndUpdate(req.user._id,{$set:{RefreshToken:undefined}},{new:true})
     const options={
      httpOnly:true,
      secure:true,
      sameSite: 'None'
    }

    res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({
      status:'ok',
      msg:'user log out'
    })


  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      msg: 'Server error',
      value: 500
    });
  }
}

const Profile=async(req,res)=>{
  try {
    console.log(req.body);
    let User = await UserModel.findByIdAndUpdate(
      req.body._id,
      req.body,
      { validateBeforeSave: false, new: true }
    ).select("-password -confirmPassword -RefreshToken");

    console.log(User)
    
    if(!User)
    {
      res.status(404).json({
        status:'fail',
        msg:'inavlid id || user not found to update '
      }) 
    }
    res.status(200).json({
      status:'ok',
      data:User
    })
    
  } catch (error) {
    res.status(500).json({
      status:'fail',
      msg:'server error'
    })
  }
}


module.exports = {signup,login,logout,Profile,generateRefreshTokenAndAccessToken};
