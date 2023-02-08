const Joi = require('joi');

const {
    CASH, 
    CREDIT,
    RETURN, 
    CANCEL,
    DAMAGE,
    RETAIL,
    WHOLESALES,
} = require('../configs/constant.config.js');

const item = Joi.object({
    itemId: Joi.string().uuid().required(),
    qty: Joi.number().required().default(0),
});

const addValidator = Joi.object({
    customer: Joi.string().required(),
    customerType: Joi.string().valid(RETAIL, WHOLESALES),
    type: Joi.string().valid(CASH, CREDIT, RETURN, CANCEL, DAMAGE),
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