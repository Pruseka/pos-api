const Joi = require('joi');

const {
    CASH, 
    CREDIT,
    RETURN, 
    CANCEL,
} = require('../configs/constant.config.js');

const item = Joi.object({
    itemId: Joi.string().uuid().required(),
    qty: Joi.number().required().default(0),
});

const addValidator = Joi.object({
    supplier: Joi.string().required(),
    type: Joi.string().valid(CASH, CREDIT, RETURN, CANCEL),
    items: Joi.array().items(item),
});

const getValidator = Joi.object({
    supplyId: Joi.string().required(),
})

const updateValidator = Joi.object({
    supplyId: Joi.string().required()
})

const getByDateValidator = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
})

module.exports = Object.freeze({
    addValidator,
    getValidator,
    updateValidator,
    getByDateValidator,
});