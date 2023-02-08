const Joi = require('joi');

const addValidator = Joi.object({
    name: Joi.string().required(),
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

