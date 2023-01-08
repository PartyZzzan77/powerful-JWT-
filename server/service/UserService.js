const User = require('../models/userModel');
const { CONSTANTS } = require('../constants/index');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('../service/MailService');
const tokenService = require('../service/TokenService');
const UserDto = require('../dto/UserDto');

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
        const userDto = new UserDto(newUser);

        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }
}

module.exports = new UserService();
