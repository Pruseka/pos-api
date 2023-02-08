const Joi = require('joi');

const addValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    amount: Joi.number().default(0),
});

const updateValidator = Joi.object({
    expenseId: Joi.string().uuid().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    amount: Joi.number().default(0),
})

const getValidatorByDate = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
});

module.exports = Object.freeze({
    addValidator,
    updateValidator,
    getValidatorByDate,
});