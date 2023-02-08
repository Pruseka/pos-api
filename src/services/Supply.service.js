const { fn, literal, Op } = require("sequelize");

const Supply = require("../models/Supply.model.js");
const Item = require("../models/Item.model.js");
const SupplyItem = require("../models/SupplyItem.model.js");
const User = require("../models/User.model.js");

const createSupply = async (supply) => {
    return await Supply.create(supply);
}

const getSuppliesByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await Supply.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        include: [
            {
                model: SupplyItem,
                include: [
                    {
                        model: Item,
                    },
                ]
            },
            {
                model: User,
                as: 'CreatedBy',
                attributes: ['name']
            }
        ]
    })
}

const getTotalAmountByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    const totalAmount = await Supply.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        attributes: [
            [fn('sum', literal(`CASE WHEN type = 'cash' THEN totalAmount WHEN type = 'return' THEN totalAmount * -1 ELSE 0 END`)), 'totalAmount'],
        ]
    });
    return totalAmount[0].get({ plain: true });
}

module.exports = Object.freeze({
    createSupply,
    getSuppliesByDate,
    getTotalAmountByDate,
})