const User = require('../models/userModel');
const { CONSTANTS } = require('../constants/index');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('../service/MailService');

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({ email });

        if (candidate) {
            throw new Error(CONSTANTS.ALREADY_EXIST);
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();
        const newUser = await User.create({
            email,
            password: hashPassword,
            activationLink,
        });

        await mailService.sendActivationMail(email, activationLink);
    }
}

module.exports = new UserService();
