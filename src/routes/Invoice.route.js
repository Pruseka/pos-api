const {
    createInvoice,
    updateInvoiceStatus,
    getCreditInvoicesByDate,
    getInvoiceByDate,
    getInvoiceById,
} = require("../controllers/Invoice.controller.js");

const { Router } = require("express");

const invoiceRoute = Router();

invoiceRoute.post('/', createInvoice);
invoiceRoute.put('/status', updateInvoiceStatus);
invoiceRoute.get('/', getInvoiceByDate);
invoiceRoute.get('/credit', getCreditInvoicesByDate);
invoiceRoute.get('/:invoiceId', getInvoiceById);

module.exports = invoiceRoute;