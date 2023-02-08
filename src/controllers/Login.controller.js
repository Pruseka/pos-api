const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserService = require("../services/User.service.js");

const LoginValidator = require("../validators/Login.validator.js");

const {
    createError
} = require("../utils/error.utils.js");

const {
    successRes
} = require("../utils/response.utils.js");

const {
    BadRequestError,
    JWT_SECRET,
} = require("../configs/constant.config.js");

const {
    INVALID_EMAIL_OR_PASSWORD
} = require("../configs/message.config.js");

const userLogin = async (req, res, next) => {
    try {
        const validation = LoginValidator.loginValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { email, password } = validation.value;
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw createError(BadRequestError, INVALID_EMAIL_OR_PASSWORD);
        };
        const isCorrect = bcrypt.compareSync(password, user.password);
        if (!isCorrect) {
            throw createError(BadRequestError, INVALID_EMAIL_OR_PASSWORD);
        }
        const token = jwt.sign({
            userId: user.userId,
            name: user.name,
            role: user.role,
        }, JWT_SECRET);
        successRes(res, null, { token });
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    userLogin,
})