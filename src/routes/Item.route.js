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
    SALES_MANAGER,
} = require('../configs/constant.config');

const itemRoute = Router();

itemRoute.get('/all', authHandler([ADMIN, VAN_SALES, SALES_MANAGER]), getAllItems);
itemRoute.post('/', authHandler([ADMIN, SALES_MANAGER]), createItem);
itemRoute.put('/', authHandler([ADMIN, SALES_MANAGER]), updateItem);
itemRoute.put('/price', authHandler([ADMIN]), updateItemPrice);

module.exports = itemRoute;