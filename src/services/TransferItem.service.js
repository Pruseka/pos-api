const { fn, Op, literal } = require("sequelize");

const TransferItem = require("../models/TransferItem.model.js");

const addAllTransferItems = async (transferItems) => {
    await TransferItem.bulkCreate(transferItems);
}

const getTransferItemsToDate = async (toDate) => {
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
            [fn('sum', literal(`CASE WHEN type = 'cash' THEN qty WHEN type = 'return' THEN qty * -1 ELSE 0 END`)), 'qty'],
        ],
        group: ['itemId']
    });
}

module.exports = Object.freeze({
    addAllTransferItems,
    getTransferItemsToDate,
})