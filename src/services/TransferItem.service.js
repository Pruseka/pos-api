const { fn, Op, literal } = require("sequelize");

const User = require('../models/User.model');
const Item = require('../models/Item.model');
const TransferItem = require("../models/TransferItem.model.js");

const addAllTransferItems = async (transferItems) => {
    await TransferItem.bulkCreate(transferItems);
}

const getTransferItemsByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await TransferItem.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp,
            }
        },
        include: [
            {
                model: User,
                attributes: ['name']
            },
            {
                model: Item,
                attributes: ['name']
            }
        ]
    })
}

const getTransferItemsToDate = async (toDate) => {
    const query = "CASE \
        WHEN type = 'to' THEN qty \
        WHEN type = 'from' THEN qty * -1 \
        ELSE 0 \
    END";
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await TransferItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp
            }
        },
        attributes: [
            'itemId',
            [fn('sum', literal(query)), 'qty'],
        ],
        group: ['itemId']
    });
}

const getTransferItemsToDateByUserId = async (toDate, userId) => {
    const query = "CASE \
        WHEN type = 'to' THEN qty \
        WHEN type = 'from' THEN qty * -1 \
        ELSE 0 \
    END";
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await TransferItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp
            },
            userId,
        },
        attributes: [
            'itemId',
            [fn('sum', literal(query)), 'qty'],
        ],
        group: ['itemId']
    });
}

module.exports = Object.freeze({
    addAllTransferItems,
    getTransferItemsByDate,
    getTransferItemsToDate,
    getTransferItemsToDateByUserId
})