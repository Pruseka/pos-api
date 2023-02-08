const Joi = require('joi');

const addValidator = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    categoryId: Joi.string().required(),
});

const updateValidator = Joi.object({
    itemId: Joi.string().required(),
    code: Joi.string().optional(),
    name: Joi.string().optional(),
    categoryId: Joi.string().optional(),
});

const updatePriceValidator = Joi.object({
    itemId: Joi.string().required(),
    purchasingPrice: Joi.number().default(0).optional(),
    retailPrice: Joi.number().default(0).optional(),
    wholesalesPrice: Joi.number().default(0).optional(),
});

module.exports = Object.freeze({
    addValidator,
    updateValidator,
    updatePriceValidator,
})
