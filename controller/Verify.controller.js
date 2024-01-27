const jwt = require('jsonwebtoken');

const generateAccessToken = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken)

        if (!refreshToken) {
            return null;
        }

        const paydata = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Remove 'exp' property if present in the payload
        delete paydata.exp;

        const accessToken = jwt.sign(paydata, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1d",
        });

        return accessToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const VerifyAccessToken = async (req, res) => {
    try {
        // console.log(req.cookies)
        let accessToken = req.cookies.accessToken;

        if (!accessToken) {
            accessToken = generateAccessToken(req, res);

            if (!accessToken) {
                return res.status(400).json({
                    status: 'fail',
                    msg: 'please relogin'
                });
            }

            // Set accessToken in response cookies
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
            });
        }

        const payloaddata = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!payloaddata) {
            return res.status(401).json({
                status: 'fail',
                msg: 'invalid Token'
            });
        }
        // console.log(payloaddata)

        delete payloaddata.exp;
        delete payloaddata.iat;

        return res.status(200).json({
            status: 'success',
            msg: 'login success',
            data: payloaddata
        });
    } catch (error) {
        console.error(error);

        if (!res.headersSent) {
            return res.status(500).json({
                status: 'fail',
                msg: 'server error'
            });
        }
    }
};

module.exports = { VerifyAccessToken, generateAccessToken };
