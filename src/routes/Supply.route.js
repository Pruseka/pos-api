const { Router } = require("express");

const {
    createSupply,
    getSupplyById,
    getSupplyByDate,
    getCreditSuppliesByDate,
    updateSupplyStatus,
} = require("../controllers/Supply.controller.js");

const authHandler = require('../middlewares/Auth.middleware');

const {
    ADMIN,
    SALES_MANAGER,
} = require("../configs/constant.config");

const supplyRoute = Router();

supplyRoute.post('/', authHandler([ADMIN, SALES_MANAGER]), createSupply);
supplyRoute.put('/status', authHandler([ADMIN]), updateSupplyStatus);
supplyRoute.get('/', authHandler([ADMIN, SALES_MANAGER]), getSupplyByDate);
supplyRoute.get('/credit', authHandler([ADMIN]), getCreditSuppliesByDate);
supplyRoute.get('/:supplyId', authHandler([ADMIN, SALES_MANAGER]), getSupplyById);

module.exports = supplyRoute;