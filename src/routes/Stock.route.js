const StockController = require("../controllers/Stock.controller.js");
const { Router } = require("express");

const stockRoute = Router();

stockRoute.get('/', StockController.getClosingStockToDate);

module.exports = stockRoute;