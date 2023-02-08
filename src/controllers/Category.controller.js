const CategoryService = require("../services/Category.service.js");

const CategoryValidator = require("../validators/Category.validator.js");

const {
    ADD_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_SUCCESS,
} = require("../configs/message.config.js");

const {
    successRes
} = require("../utils/response.utils.js");

const addCategory = async (req, res, next) => {
    try {
        const validation = CategoryValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        await CategoryService.createCategory(validation.value);
        successRes(res, ADD_CATEGORY_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const validation = CategoryValidator.updateValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { categoryId, name } = validation.value;
        await CategoryService.updateCategory(categoryId, { name });
        successRes(res, UPDATE_CATEGORY_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getAllCategories = async (_, res, next) => {
    try {
        const categories = await CategoryService.getAllCategories();
        successRes(res, null, categories);
    } catch (err) {
        next(err);
    }
}


module.exports = Object.freeze({
    addCategory,
    updateCategory,
    getAllCategories
})