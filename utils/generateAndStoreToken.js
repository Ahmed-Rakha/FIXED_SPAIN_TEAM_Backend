const JWT_SECRET = process.env.JWT_SECRET;
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const generateAndStoreTokens = (res,payload) => {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    // store tokens
        res.cookie("access-token", token, {
            httpOnly: true,
            maxAge: new Date(Date.now() + 24 * 60 * 60 * 1000),
            secure: process.env?.NODE_ENV  !== 'development',
			sameSite: 'none',
          
        });
        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            maxAge: new Date(Date.now() + 24 * 60 * 60 * 1000),
			secure: process.env?.NODE_ENV !== 'development',
			sameSite: 'none',
        });

    return { token, refreshToken };
};

module.exports = { generateAndStoreTokens }