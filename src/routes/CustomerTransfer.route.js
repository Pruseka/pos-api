const CustomerTransferController = require("../controllers/CustomerTransfer.controller.js");
const { Router } = require("express");

const customerTransferRoute = Router();

customerTransferRoute.post('/', CustomerTransferController.createCustomerTransfer);
customerTransferRoute.get('/', CustomerTransferController.getCustomerTransferByDate);

module.exports = customerTransferRoute;