const { fn, Op, literal } = require("sequelize");

const SupplyItem = require("../models/SupplyItem.model.js");

const addAllSupplyItems = async (supplyItems) => {
    await SupplyItem.bulkCreate(supplyItems);
}

const getSupplyItemsToDate = async(toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() +1);
    return await SupplyItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp
            }
        },
        attributes: [
            'itemId',
            [fn('sum', literal(`CASE WHEN type = 'cash' THEN qty WHEN type = 'return' THEN qty * -1 ELSE 0 END`)), 'qty'],
        ],
        group: ['itemId'],
    });
}

module.exports = Object.freeze({
    addAllSupplyItems,
    getSupplyItemsToDate,
});