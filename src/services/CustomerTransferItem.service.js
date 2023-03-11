const { fn, Op, literal } = require("sequelize");

const CustomerTransfer = require('../models/CustomerTransfer.model');
const CustomerTransferItem = require("../models/CustomerTransferItem.model.js");

const addAllCustomerTransferItems = async (customertransferItems) => {
    await CustomerTransferItem.bulkCreate(customertransferItems);
}

const getCustomerTransferItemsToDate = async (toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await CustomerTransferItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp
            }
        },
        attributes: [
            'itemId',
            [fn('sum', literal(`CASE WHEN type = 'in' THEN qty ELSE -1 * qty END`)), 'qty'],
        ],
        group: ['itemId']
    });
}

const getCustomerTransferItemsByDateAndCustomerId = async (fromDate, toDate, customerId) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await CustomerTransferItem.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp,
            },
            customerId,
        },
        include: [
            {
                model: Item,
                attributes: ['code', 'name'],
                include: [
                    {
                        model: Category,
                        attributes: ['name']
                    }
                ]
            }
        ]
    })
}

module.exports = Object.freeze({
    addAllCustomerTransferItems,
    getCustomerTransferItemsToDate,
    getCustomerTransferItemsByDateAndCustomerId,
});