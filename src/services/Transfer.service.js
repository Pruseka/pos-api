const { Op } = require("sequelize");

const User = require("../models/User.model.js");
const Transfer = require("../models/Transfer.model.js");
const TransferItem = require("../models/TransferItem.model.js");
const Item = require("../models/Item.model.js");

const createTransfer = async (transfer) => {
    return await Transfer.create(transfer);
}

const getTransfersByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await Transfer.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        include: [
            {
                model: TransferItem,
                include: [
                    {
                        model: Item,
                    },
                ]
            },
            {
                model: User,
                as: 'User',
                attributes: ['name']
            },
            {
                model: User,
                as: 'CreatedBy',
                attributes: ['name']
            }
        ]
    })
}

module.exports = Object.freeze({
    createTransfer,
    getTransfersByDate,
})