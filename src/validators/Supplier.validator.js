const Joi = require('joi');

const addValidator = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.string().optional().allow(''),
    address: Joi.string().optional().allow(''),
});

const updateValidator = Joi.object({
    supplierId: Joi.string().uuid().required(),
    code: Joi.string().optional(),
    name: Joi.string().optional(),
    phone: Joi.string().optional().allow(''),
    address: Joi.string().optional().allow(''),
})

module.exports = Object.freeze({
    addValidator,
    updateValidator,
});