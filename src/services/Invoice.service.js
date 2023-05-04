const { fn, literal, Op } = require("sequelize");

const User = require("../models/User.model.js");
const Invoice = require("../models/Invoice.model.js");
const InvoiceItem = require("../models/InvoiceItem.model.js");
const Item = require("../models/Item.model.js");
const Category = require("../models/Category.model.js");
const { UNPAID, CREDIT, PAID } = require("../configs/constant.config.js");

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
            {
                model: User,
                as: 'CreatedBy',
                attributes: ['userId', 'name']
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
                    type: CREDIT,
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
        ],
        order: [
            ['status', 'DESC']
        ]
    })
}

const getAmountByDate = async (fromDate, toDate) => {
    const query = "CASE \
        WHEN type = 'cash' THEN amount \
        WHEN type = 'credit' THEN amount \
        WHEN type = 'return' THEN amount * -1 \
        WHEN type = 'cancel' THEN 0 \
        WHEN type = 'damage' THEN 0 \
        ELSE 0 \
    END";
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    const amount = await Invoice.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        attributes: [
            [fn('sum', literal(query)), 'amount'],
        ]
    });
    if (amount.length < 1) {
        return 0;
    }
    const totalAmount = amount[0].get({ plain: true });
    return totalAmount.amount ? totalAmount.amount : 0;
}

const getCashInByDate = async (fromDate, toDate) => {
    const query = "CASE \
        WHEN type = 'cash' THEN amount \
        WHEN type = 'credit' THEN amount \
        WHEN type = 'return' THEN amount * -1 \
        WHEN type = 'cancel' THEN 0 \
        WHEN type = 'damage' THEN 0 \
        ELSE 0 \
    END";
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    const amount = await Invoice.findAll({
        where: {
            receivedAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        attributes: [
            [fn('sum', literal(query)), 'amount'],
        ]
    });
    if (amount.length < 1) {
        return 0;
    }
    const totalAmount = amount[0].get({ plain: true });
    return totalAmount.amount ? totalAmount.amount : 0;
}

module.exports = Object.freeze({
    createInvoice,
    updateInvoice,
    getInvoiceById,
    getInvoicesByDate,
    getCreditInvoicesByDate,
    getAmountByDate,
    getCashInByDate,
})