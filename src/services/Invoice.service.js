const { fn, literal, Op } = require("sequelize");

const User = require("../models/User.model.js");
const Invoice = require("../models/Invoice.model.js");
const InvoiceItem = require("../models/InvoiceItem.model.js");
const Item = require("../models/Item.model.js");
const Category = require("../models/Category.model.js");
const { UNPAID, PAID } = require("../configs/constant.config.js");

const createInvoice = async (invoice) => {
    return await Invoice.create(invoice);
}

const updateInvoice = async (invoiceId, invoice) => {
    await Invoice.update(invoice, {
        where: { invoiceId }
    })
}

const getInvoiceById = async (invoiceId) => {
    return await Invoice.findByPk(invoiceId, {
        include: [
            {
                model: InvoiceItem,
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
    })
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
            // {
            //     model: InvoiceItem,
            //     include: [
            //         {
            //             model: Item,
            //             attributes: ['code', 'name'],
            //             include: [
            //                 {
            //                     model: Category,
            //                     attributes: ['name']
            //                 }
            //             ]
            //         },
            //     ]
            // },
            {
                model: User,
                as: 'CreatedBy',
                attributes: ['name']
            }
        ]
    })
};

const getCreditInvoicesByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await Invoice.findAll({
        where: {
            [Op.or]: [
                {
                    status: UNPAID
                },
                {
                    status: PAID,
                    receivedAt: {
                        [Op.gte]: fromDate,
                        [Op.lt]: temp,
                    }
                }
            ]
        },
        include: [
            {
                model: User,
                as: 'ReceivedBy',
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
    updateInvoice,
    getInvoiceById,
    getInvoicesByDate,
    getCreditInvoicesByDate,
    getTotalAmountByDate,
})