const Joi = require('joi');

const getToDateValidator = Joi.object({
    to: Joi.date().required(),
    customerId: Joi.string().uuid().required(),
});

const getByDateValidator = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
    customerId: Joi.string().uuid()
})

module.exports = Object.freeze({
    getToDateValidator,
    getByDateValidator
})