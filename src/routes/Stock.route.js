const { Router } = require("express");
const {
    getClosingToDate
} = require("../controllers/Stock.controller.js");

const stockRoute = Router();

stockRoute.get('/closing', getClosingToDate);

module.exports = stockRoute;