const { Router } = require("express");

const {
    addCustomer,
    updateCustomer,
    getAllCustomers,
} = require("../controllers/Customer.controller");

const customerRoute = Router();

customerRoute.get('/all', getAllCustomers);
customerRoute.post('/', addCustomer);
customerRoute.put('/', updateCustomer);

module.exports = customerRoute;