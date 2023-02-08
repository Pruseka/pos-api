const Category = require("../models/Category.model.js");

const createCategory = async (category) => {
    await Category.create(category);
}

const getAllCategories = async () => {
    return await Category.findAll();
}

const getCategoryById = async (categoryId) => {
    return await Category.findByPk(categoryId);
}

const updateCategory = async (categoryId, category) => {
    await Category.update(category, {
        where: { categoryId }
    })
}

module.exports = Object.freeze({
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
})