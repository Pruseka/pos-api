const Joi = require('joi');

const getByDateValidator = Joi.object({
    to: Joi.date().required(),
});

module.exports = Object.freeze({
    getByDateValidator
})