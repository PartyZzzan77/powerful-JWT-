const jwt = require('jsonwebtoken');
const Token = require('../models/tokenModel');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, ACCESS_SECRET, {
            expiresIn: '30m',
        });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
            expiresIn: '30d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await Token.create({ user: userId, refreshToken });

        return token;
    }
}

module.exports = new TokenService();
