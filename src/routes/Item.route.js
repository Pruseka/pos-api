const { Router } = require("express");

const {
    getAllItems,
    createItem,
    updateItem,
    updateItemPrice,
} = require("../controllers/Item.controller.js");

const authHandler = require('../middlewares/Auth.middleware');

const {
    ADMIN,
    VAN_SALES,
    SALES_ADMIN,
} = require('../configs/constant.config');

const itemRoute = Router();

itemRoute.get('/all', authHandler([ADMIN, VAN_SALES, SALES_ADMIN]), getAllItems);
itemRoute.post('/', authHandler([ADMIN, SALES_ADMIN]), createItem);
itemRoute.put('/', authHandler([ADMIN, SALES_ADMIN]), updateItem);
itemRoute.put('/price', authHandler([ADMIN]), updateItemPrice);

module.exports = itemRoute;