const { Router } = require("express");
const {
    getClosingToDate,
    getInRecordByDate,
    getOutRecordByDate,
} = require("../controllers/CustomerStock.controller");

const customerStockRoute = Router();

customerStockRoute.get('/closing', getClosingToDate);
customerStockRoute.get('/in', getInRecordByDate);
customerStockRoute.get('/out', getOutRecordByDate);

module.exports = customerStockRoute;