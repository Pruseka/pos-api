const { Router } = require("express");
const {
    getClosingToDate,
    getSupplyRecordByDate,
    getTransferRecordByDate,
    getInvoiceRecordByDate
} = require("../controllers/Warehouse.controller.js");

const warehouseRoute = Router();

warehouseRoute.get('/closing', getClosingToDate);
warehouseRoute.get('/supply', getSupplyRecordByDate);
warehouseRoute.get('/transfer', getTransferRecordByDate);
warehouseRoute.get('/invoice', getInvoiceRecordByDate);

module.exports = warehouseRoute;