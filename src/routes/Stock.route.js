const { Router } = require("express");
const {
    getClosingToDate,
    getInRecordByDate,
    getOutRecordByDate,
} = require("../controllers/Stock.controller.js");

const stockRoute = Router();

stockRoute.get('/closing', getClosingToDate);
stockRoute.get('/in', getInRecordByDate);
stockRoute.get('/out', getOutRecordByDate);

module.exports = stockRoute;