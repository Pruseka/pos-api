const CustomerService = require("../services/Customer.service.js");

const CustomerValidator = require("../validators/Customer.validator.js");

const {
    ADD_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_SUCCESS,
} = require("../configs/message.config.js");

const {
    successRes
} = require("../utils/response.utils.js");

const addCustomer = async (req, res, next) => {
    try {
        const validation = CustomerValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        await CustomerService.createCustomer(validation.value);
        successRes(res, ADD_CUSTOMER_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const updateCustomer = async (req, res, next) => {
    try {
        const validation = CustomerValidator.updateValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { customerId, ...customer } = validation.value;
        await CustomerService.updateCustomer(customerId, customer);
        successRes(res, UPDATE_CUSTOMER_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getAllCustomers = async (_, res, next) => {
    try {
        const customers = await CustomerService.getAllCustomers();
        successRes(res, null, customers);
    } catch (err) {
        next(err);
    }
}


module.exports = Object.freeze({
    addCustomer,
    updateCustomer,
    getAllCustomers
})