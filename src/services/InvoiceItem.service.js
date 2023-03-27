const { fn, Op, literal } = require("sequelize");

const Invoice = require("../models/Invoice.model.js");
const Item = require('../models/Item.model');
const InvoiceItem = require("../models/InvoiceItem.model.js");
const Category = require("../models/Category.model.js");

const addAllInvoiceItems = async (invoiceItems) => {
    await InvoiceItem.bulkCreate(invoiceItems);
}

const getInvoiceItemsToDate = async (toDate) => {
    const query = "CASE \
        WHEN type = 'cash' THEN qty \
        WHEN type = 'credit' THEN qty \
        WHEN type = 'return' THEN qty * -1 \
        WHEN type = 'cancel' THEN 0 \
        WHEN type = 'damage' THEN qty \
        ELSE 0 \
    END";
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await InvoiceItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp
            }
        },
        attributes: [
            'itemId',
            [fn('sum', literal(query)), 'qty'],
        ],
        group: ['itemId']
    });
}

const getInvoiceItemsToDateByUserId = async (toDate, userId) => {
    const query = "CASE \
        WHEN InvoiceItem.type = 'cash' THEN qty \
        WHEN InvoiceItem.type = 'credit' THEN qty \
        WHEN InvoiceItem.type = 'return' THEN qty * -1 \
        WHEN InvoiceItem.type = 'cancel' THEN 0 \
        WHEN InvoiceItem.type = 'damage' THEN qty \
        ELSE 0 \
    END";
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await InvoiceItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp
            },
        },
        include: [
            {
                model: Invoice,
                where: {
                    createdBy: userId
                }
            }
        ],
        attributes: [
            'itemId',
            [fn('sum', literal(query)), 'qty'],
        ],
        group: ['itemId']
    });
}

const getInvoiceItemsToDateAndExcludedUserIds = async (toDate, userIds) => {
    const query = "CASE \
        WHEN InvoiceItem.type = 'cash' THEN qty \
        WHEN InvoiceItem.type = 'credit' THEN qty \
        WHEN InvoiceItem.type = 'return' THEN qty * -1 \
        WHEN InvoiceItem.type = 'cancel' THEN 0 \
        WHEN InvoiceItem.type = 'damage' THEN qty \
        ELSE 0 \
    END";
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await InvoiceItem.findAll({
        where: {
            createdAt: {
                [Op.lt]: temp
            },
        },
        include: [
            {
                model: Invoice,
                where: {
                    createdBy: {
                        [Op.notIn]: userIds,
                    },
                },
            }
        ],
        attributes: [
            'itemId',
            [fn('sum', literal(query)), 'qty'],
        ],
        group: ['itemId']
    });
}

const getInvoiceItemsByDateAndUserId = async (fromDate, toDate, userId) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await InvoiceItem.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp,
            },
        },
        include: [
            {
                model: Invoice,
                where: {
                    createdBy: userId
                },
                attributes: ['customer']
            },
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
        ],
    });
}

const getInvoiceItemsByDateAndExcludedUserIds = async (fromDate, toDate, userIds) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await InvoiceItem.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp,
            },
        },
        include: [
            {
                model: Invoice,
                where: {
                    createdBy: {
                        [Op.notIn]: userIds
                    }
                },
                attributes: ['customer']
            },
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
        ],
    });
}

module.exports = Object.freeze({
    addAllInvoiceItems,
    getInvoiceItemsToDate,
    getInvoiceItemsToDateByUserId,
    getInvoiceItemsToDateAndExcludedUserIds,
    getInvoiceItemsByDateAndUserId,
    getInvoiceItemsByDateAndExcludedUserIds,
})