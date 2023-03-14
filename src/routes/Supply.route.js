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
    SALES_ADMIN,
} = require("../configs/constant.config");

const supplyRoute = Router();

supplyRoute.post('/', authHandler([ADMIN, SALES_ADMIN]), createSupply);
supplyRoute.put('/status', authHandler([ADMIN]), updateSupplyStatus);
supplyRoute.get('/', authHandler([ADMIN, SALES_ADMIN]), getSupplyByDate);
supplyRoute.get('/credit', authHandler([ADMIN]), getCreditSuppliesByDate);
supplyRoute.get('/:supplyId', authHandler([ADMIN, SALES_ADMIN]), getSupplyById);

module.exports = supplyRoute;