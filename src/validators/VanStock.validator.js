const Joi = require('joi');

const getToDateValidator = Joi.object({
    to: Joi.date().required(),
    userId: Joi.string().uuid().required(),
});

const getByDateValidator = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
    userId: Joi.string().uuid()
})

module.exports = Object.freeze({
    getToDateValidator,
    getByDateValidator
})