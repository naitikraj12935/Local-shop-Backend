const jwt=require('jsonwebtoken')
const UserModel=require('../Models/Usermodel');

const Jwtverify = async (req, res, next) => {
    try {
        console.log(req.cookies)
        let token = req.cookies.refreshToken;

        console.log(token)

        if (!token) {
           return res.status(401).json({
               status: 'fail',
               message: 'No token found'
           });
        }
        
        const data = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        if (!data) {
            return res.status(401).json({
                status: 'fail',
                message: 'Token verification failed'
            });
        }

        const user = await UserModel.findById(data._id).select("-password");

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Not a valid token'
            });
        }

        console.log(user);
        req.user = user;
        next();
    } catch (error) {
        
        return res.status(400).json({ status: 'error', msg:error.message });
    }
}



module.exports = Jwtverify;

