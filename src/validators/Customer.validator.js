const Joi = require('joi');

const {
    RETAIL,
    WHOLESALES
} = require('../configs/constant.config');

const addValidator = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().valid(RETAIL, WHOLESALES),
    phone: Joi.string().optional().allow(''),
    address: Joi.string().optional().allow(''),
});

const updateValidator = Joi.object({
    customerId: Joi.string().uuid().required(),
    code: Joi.string().optional(),
    name: Joi.string().optional(),
    type: Joi.string().valid(RETAIL, WHOLESALES),
    phone: Joi.string().optional().allow(''),
    address: Joi.string().optional().allow(''),
})

module.exports = Object.freeze({
    addValidator,
    updateValidator,
});