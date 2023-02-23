const { fn, Op, literal } = require("sequelize");

const Supply = require("../models/Supply.model.js");
const Item = require('../models/Item.model');
const SupplyItem = require("../models/SupplyItem.model.js");

const addAllSupplyItems = async (supplyItems) => {
    await SupplyItem.bulkCreate(supplyItems);
}

const getSupplyItemsByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await SupplyItem.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp,
            }
        },
        include: [
            {
                model: Supply,
                attributes: ['supplier']
            },
            {
                model: Item,
                attributes: ['name']
            }
        ]
    })
}

const getSupplyItemsToDate = async (toDate) => {
    const query = "CASE \
        WHEN type = 'cash' THEN qty \
        WHEN type = 'credit' THEN qty \
        WHEN type = 'return' THEN qty * -1 \
        WHEN type = 'cancel' THEN 0 \
        ELSE 0 \
    END";
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await SupplyItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp
            }
        },
        attributes: [
            'itemId',
            [fn('sum', literal(query)), 'qty'],
        ],
        group: ['itemId'],
    });
}

module.exports = Object.freeze({
    addAllSupplyItems,
    getSupplyItemsByDate,
    getSupplyItemsToDate,
});