const { fn, literal, Op } = require("sequelize");
const { CREDIT, UNPAID, PAID } = require("../configs/constant.config.js");
const Category = require("../models/Category.model.js");
const Item = require("../models/Item.model.js");

const Supply = require("../models/Supply.model.js");
const SupplyItem = require("../models/SupplyItem.model.js");
const User = require("../models/User.model.js");

const createSupply = async (supply) => {
    return await Supply.create(supply);
}

const updateSupply = async (supplyId, supply) => {
    await Supply.update(supply, {
        where: { supplyId }
    })
}

const getSupplyById = async (supplyId) => {
    return await Supply.findByPk(supplyId, {
        include: [
            {
                model: SupplyItem,
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
            },
            {
                model: User,
                as: 'CreatedBy',
                attributes: ['name']
            }
        ]
    });
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
            // {
            //     model: SupplyItem,
            //     include: [
            //         {
            //             model: Item,
            //         },
            //     ]
            // },
            {
                model: User,
                as: 'CreatedBy',
                attributes: ['name']
            }
        ],
    })
}

const getCreditSuppliesByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await Supply.findAll({
        where: {
            [Op.or]: [
                {
                    status: UNPAID
                },
                {
                    status: PAID,
                    type: CREDIT,
                    withdrawnAt: {
                        [Op.gte]: fromDate,
                        [Op.lt]: temp,
                    }
                }
            ]
        },
        include: [
            {
                model: User,
                as: 'WithdrawnBy',
                attributes: ['name']
            },
            {
                model: User,
                as: 'CreatedBy',
                attributes: ['name']
            }
        ],
        order: [
            ['status', 'DESC']
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
    updateSupply,
    getSupplyById,
    getSuppliesByDate,
    getCreditSuppliesByDate,
    getTotalAmountByDate,
})