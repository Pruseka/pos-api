const Joi = require('joi');

const {
    IN,
    OUT,
} = require('../configs/constant.config.js');

const item = Joi.object({
    itemId: Joi.string().uuid().required(),
    qty: Joi.number().required().default(0),
});

const addValidator = Joi.object({
    customerId: Joi.string().uuid().required(),
    type: Joi.string().valid(IN, OUT),
    items: Joi.array().items(item),
});

const getByDateValidator = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
})

module.exports = Object.freeze({
    addValidator,
    getByDateValidator,
});