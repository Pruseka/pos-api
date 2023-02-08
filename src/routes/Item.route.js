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
    SALESMAN,
} = require('../configs/constant.config');

const itemRoute = Router();

itemRoute.get('/all', authHandler([ADMIN, SALESMAN]), getAllItems);
itemRoute.post('/', authHandler([ADMIN, SALESMAN]), createItem);
itemRoute.put('/', authHandler([ADMIN, SALESMAN]), updateItem);
itemRoute.put('/price', authHandler([ADMIN]), updateItemPrice);

module.exports = itemRoute;