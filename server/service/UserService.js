const User = require('../models/userModel');
const { CONSTANTS } = require('../constants/index');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('../service/MailService');
const tokenService = require('../service/TokenService');
const UserDto = require('../dto/UserDto');
const ApiError = require('../exceptions/ApiError');

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({ email });

        if (candidate) {
            throw ApiError.BadRequest(CONSTANTS.ALREADY_EXIST);
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();
        const newUser = await User.create({
            email,
            password: hashPassword,
            activationLink,
        });

        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/activate/${activationLink}`
        );
        const userDto = new UserDto(newUser);

        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async activate(activationLink) {
        const user = await User.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequest(CONSTANTS.INVALID_ACTIVATE_LINK);
        }
        user.isActivated = true;

        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({ email });

        if (!user) {
            throw ApiError.BadRequest(CONSTANTS.USER_NOT_FOUND);
        }

        const isPasswordEquals = await bcrypt.compare(password, user.password);
        console.log(isPasswordEquals);

        if (!isPasswordEquals) {
            throw ApiError.BadRequest(CONSTANTS.INVALID_PASSWORD);
        }

        const userDto = new UserDto(user);

        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);

        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenInDB = tokenService.findToken(refreshToken);

        if (!userData || !tokenInDB) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findById(userData.id);
        const userDto = new UserDto(user);

        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }
}

module.exports = new UserService();
