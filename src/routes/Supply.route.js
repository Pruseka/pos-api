const { Router } = require("express");
const {
    createSupply,
    getSupplyByDate,
} = require("../controllers/Supply.controller.js");

const supplyRoute = Router();

supplyRoute.post('/', createSupply);
supplyRoute.get('/', getSupplyByDate);

module.exports = supplyRoute;