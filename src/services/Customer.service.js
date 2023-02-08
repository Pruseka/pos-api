const Customer = require("../models/Customer.model.js");

const createCustomer = async (customer) => {
    await Customer.create(customer);
}

const getAllCustomers = async () => {
    return await Customer.findAll();
}

const getCustomerById = async (customerId) => {
    return await Customer.findByPk(customerId);
}

const updateCustomer = async (customerId, customer) => {
    await Customer.update(customer, {
        where: { customerId }
    })
}

module.exports = Object.freeze({
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
})