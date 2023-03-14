const bcrypt = require('bcryptjs');

const UserService = require("../services/User.service.js");

const UserValidator = require("../validators/User.validator.js");

const {
    ADD_USER_SUCCESS,
    ADD_ADMIN_SUCCESS,
    UPDATE_USER_SUCCESS,
    INVALID_APP_SECRET,
    UPDATE_PASSWORD_SUCCESS,
} = require("../configs/message.config.js");

const {
    ADMIN,
    APP_SECRET,
    BadRequestError,
    SALT_ROUND,
} = require('../configs/constant.config');

const {
    createError
} = require('../utils/error.utils');

const {
    successRes
} = require("../utils/response.utils.js");

const addAdmin = async (req, res, next) => {
    try {
        const validation = UserValidator.addAdminValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { secret, ...admin } = validation.value;
        if (secret !== APP_SECRET) {
            throw createError(BadRequestError, INVALID_APP_SECRET);
        }
        const salt = bcrypt.genSaltSync(SALT_ROUND);
        const password = bcrypt.hashSync(admin.password, salt);
        await UserService.createUser({
            ...admin,
            password,
            role: ADMIN,
        });
        successRes(res, ADD_ADMIN_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const addUser = async (req, res, next) => {
    try {
        const validation = UserValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { password, ...user } = validation.value;
        const salt = bcrypt.genSaltSync(SALT_ROUND);
        const hashPassword = bcrypt.hashSync(password, salt);
        await UserService.createUser({
            ...user,
            password: hashPassword,
        });
        successRes(res, ADD_USER_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const validation = UserValidator.updateValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { userId, ...user } = validation.value;
        await UserService.updateUser(userId, user);
        successRes(res, UPDATE_USER_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const validation = UserValidator.updatePasswordValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { userId, password } = validation.value;
        const salt = bcrypt.genSaltSync(SALT_ROUND);
        const hashPassword = bcrypt.hashSync(password, salt);
        await UserService.updateUser(userId, {
            password: hashPassword
        });
        successRes(res, UPDATE_PASSWORD_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getAllUsers = async (_, res, next) => {
    try {
        const _users = await UserService.getAllUsers();
        const users = _users.map(_user => {
            const { password, createdAt, updatedAt, ...user } = _user.get({ plain: true });
            return user;
        })
        successRes(res, null, users);
    } catch (err) {
        next(err);
    }
}

const getAllVanSales = async (_, res, next) => {
    try {
        const _users = await UserService.getAllVanSales();
        const users = _users.map(_user => {
            const { password, createdAt, updatedAt, ...user } = _user.get({ plain: true });
            return user;
        });
        successRes(res, null, users);
    } catch (err) {
        next(err);
    }
}

const getAllSalesManagers = async (_, res, next) => {
    try {
        const _users = await UserService.getAllSalesManagers();
        const users = _users.map(_user => {
            const { password, createdAt, updatedAt, ...user } = _user.get({ plain: true });
            return user;
        });
        successRes(res, null, users);
    } catch (err) {
        next(err);
    }
}


module.exports = Object.freeze({
    addAdmin,
    addUser,
    updateUser,
    updatePassword,
    getAllUsers,
    getAllVanSales,
    getAllSalesManagers,
})