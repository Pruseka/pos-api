const ItemService = require('../services/Item.service.js');
const CategoryService = require('../services/Category.service');
const ItemValidator = require('../validators/Item.validator.js');

const createError = require('../utils/error.utils')

const {
    successRes
} = require('../utils/response.utils.js');

const {
    ADD_ITEM_SUCCESS,
    UPDATE_ITEM_SUCCESS,
    CATEGORY_NOT_EXIST,
} = require('../configs/message.config.js');

const {
    ADMIN,
    BadRequestError
} = require('../configs/constant.config.js');

const createItem = async (req, res, next) => {
    try {
        const validation = ItemValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const categoryId = validation.value.categoryId;
        const category = await CategoryService.getCategoryById(categoryId);
        if (!category) {
            throw createError(BadRequestError, CATEGORY_NOT_EXIST);
        }
        await ItemService.createItem(validation.value);
        successRes(res, ADD_ITEM_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const updateItem = async (req, res, next) => {
    try {
        const validation = ItemValidator.updateValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const categoryId = validation.value.categoryId;
        const category = await CategoryService.getCategoryById(categoryId);
        if (!category) {
            throw createError(BadRequestError, CATEGORY_NOT_EXIST);
        }
        const { itemId, ...item } = validation.value;
        await ItemService.updateItem(itemId, item);
        successRes(res, UPDATE_ITEM_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const updateItemPrice = async (req, res, next) => {
    try {
        const validation = ItemValidator.updatePriceValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { itemId, ...item } = validation.value;
        await ItemService.updateItem(itemId, item);
        successRes(res, UPDATE_ITEM_SUCCESS);
    } catch (err) {
        next(err);
    }
}


const getAllItems = async (req, res, next) => {
    try {
        const _items = await ItemService.getAllItems();
        const items = _items.map(_item => {
            const {
                Category, categoryId,
                ...item
            } = _item.get({plain: true});
            return {
                category: Category.name,
                ...item,
            }
        })
        const salesmanItem = items.map(_item => {
            const {
                purchasingPrice,
                ...item
            } = _item;
            return item;
        });
        successRes(res, null, req.user.role === ADMIN ? items : salesmanItem);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    createItem,
    updateItem,
    updateItemPrice,
    getAllItems,
})