const { Router } = require("express");
const {
    getClosingToDate,
    getInRecordByDate,
    getOutRecordByDate,
} = require("../controllers/Warehouse.controller.js");

const warehouseRoute = Router();

warehouseRoute.get('/closing', getClosingToDate);
warehouseRoute.get('/in', getInRecordByDate);
warehouseRoute.get('/out', getOutRecordByDate);

module.exports = warehouseRoute;