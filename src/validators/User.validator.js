const Joi = require('joi');

const {
    ADMIN,
    SALES_ADMIN,
    VAN_SALES,
} = require("../configs/constant.config");

const addValidator = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required().valid(ADMIN, SALES_ADMIN, VAN_SALES),
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const addAdminValidator = Joi.object({
    secret: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
})

const updateValidator = Joi.object({
    userId: Joi.string().uuid().required(),
    name: Joi.string().optional(),
    role: Joi.string().required().valid(ADMIN, SALES_ADMIN, VAN_SALES),
    email: Joi.string().optional(),
});

const updatePasswordValidator = Joi.object({
    userId: Joi.string().uuid().required(),
    password: Joi.string().required(),
});

module.exports = Object.freeze({
    addValidator,
    addAdminValidator,
    updateValidator,
    updatePasswordValidator,
})

