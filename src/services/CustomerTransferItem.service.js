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
            [fn('sum', literal(`CASE WHEN type = 'cash' THEN qty WHEN type = 'return' THEN qty * -1 ELSE 0 END`)), 'qty'],
        ],
        group: ['itemId']
    });
}

const getTransferItemsToDate = async(toDate, customerId) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() +1);
    return await CustomerTransferItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp,
            },
            customerId
        },
        include: [
            {
                model: CustomerTransfer,
                where: {
                    customerId
                },
                attributes: ['']
            }
        ]
    });
}

module.exports = Object.freeze({
    addAllCustomerTransferItems,
    getCustomerTransferItemsToDate,
})