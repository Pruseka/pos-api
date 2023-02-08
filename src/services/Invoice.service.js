const { fn, literal, Op } = require("sequelize");

const User = require("../models/User.model.js");
const Invoice = require("../models/Invoice.model.js");
const InvoiceItem = require("../models/InvoiceItem.model.js");
const Item = require("../models/Item.model.js");

const createInvoice = async (invoice) => {
    return await Invoice.create(invoice);
}

const getInvoicesByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await Invoice.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        include: [
            {
                model: InvoiceItem,
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
    const totalAmount = await Invoice.findAll({
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
    createInvoice,
    getInvoicesByDate,
    getTotalAmountByDate,
})