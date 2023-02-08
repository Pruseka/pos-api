const Joi = require('joi');

const {
    TO,
    FROM,
} = require('../configs/constant.config.js');

const item = Joi.object({
    itemId: Joi.string().uuid().required(),
    qty: Joi.number().required().default(0),
});

const addValidator = Joi.object({
    userId: Joi.string().uuid().required(),
    type: Joi.string().valid(TO, FROM),
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