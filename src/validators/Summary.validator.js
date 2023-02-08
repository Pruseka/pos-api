const Joi = require('joi');

const getValidatorByDate = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
});

module.exports = Object.freeze({
    getValidatorByDate,
});