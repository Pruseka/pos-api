const Joi = require('joi');

const addValidator = Joi.object({
    name: Joi.string().required(),
});

const updateValidator = Joi.object({
    categoryId: Joi.string().uuid().required(),
    name: Joi.string().required(),
})

module.exports = Object.freeze({
    addValidator,
    updateValidator,
});