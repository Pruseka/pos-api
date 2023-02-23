const Joi = require('joi');

const getToDateValidator = Joi.object({
    to: Joi.date().required(),
});

const getByDateValidator =Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
})

module.exports = Object.freeze({
    getToDateValidator,
    getByDateValidator
})