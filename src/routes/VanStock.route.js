const { Router } = require("express");

const {
    getClosingToDate,
    getTransferRecordByDate,
    getInvoiceRecordByDate,
} = require("../controllers/VanStock.controller");

const vanStockRoute = Router();

vanStockRoute.get('/closing', getClosingToDate);
vanStockRoute.get('/transfer', getTransferRecordByDate);
vanStockRoute.get('/invoice', getInvoiceRecordByDate);

module.exports = vanStockRoute;