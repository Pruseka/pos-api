const { Op } = require("sequelize");

const Item = require("../models/Item.model.js");
const Category = require("../models/Category.model.js");

const createItem = async (item) => {
    await Item.create(item);
}

const getItemById = async (itemId) => {
    return await Item.findByPk(itemId);
}

const getItemByCode = async (code) => {
    return await Item.findOne({
        where: { code }
    })
}

const getItemsByCodes = async (codes) => {
    return await Item.findAll({
        where: {
            code: {
                [Op.in]: codes
            }
        }
    });
}

const getItemsByIds = async (itemIds) => {
    return await Item.findAll({
        where: {
            itemId: {
                [Op.in]: itemIds
            }
        }
    });
}

const getAllItems = async () => {
    return await Item.findAll({
        include: [
            {
                model: Category,
                attributes: ['name']
            }
        ]
    });
}

const updateItem = async (itemId, item) => {
    await Item.update(item, {
        where: { itemId }
    })
}

module.exports = Object.freeze({
    createItem,
    getAllItems,
    getItemById,
    getItemsByIds,
    getItemByCode,
    getItemsByCodes,
    updateItem,
})