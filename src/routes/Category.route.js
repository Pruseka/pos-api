const { Router } = require("express");

const {
    addCategory,
    updateCategory,
    getAllCategories,
} = require("../controllers/Category.controller");

const categoryRoute = Router();

categoryRoute.get('/all', getAllCategories);
categoryRoute.post('/', addCategory);
categoryRoute.put('/', updateCategory);

module.exports = categoryRoute;