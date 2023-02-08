const InvoiceController = require("../controllers/Invoice.controller.js");
const { Router } = require("express");

const invoiceRoute = Router();

invoiceRoute.post('/', InvoiceController.createInvoice);
invoiceRoute.get('/', InvoiceController.getInvoiceByDate);

module.exports = invoiceRoute;