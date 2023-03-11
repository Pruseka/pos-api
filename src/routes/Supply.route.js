const { Router } = require("express");
const {
    createSupply,
    getSupplyById,
    getSupplyByDate,
    getCreditSuppliesByDate,
    updateSupplyStatus,
} = require("../controllers/Supply.controller.js");

const supplyRoute = Router();

supplyRoute.post('/', createSupply);
supplyRoute.put('/status', updateSupplyStatus);
supplyRoute.get('/', getSupplyByDate);
supplyRoute.get('/credit', getCreditSuppliesByDate);
supplyRoute.get('/:supplyId', getSupplyById);

module.exports = supplyRoute;