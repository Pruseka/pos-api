const { fn, Op, literal } = require("sequelize");

const Invoice = require("../models/Invoice.model.js");
const Item = require('../models/Item.model');
const InvoiceItem = require("../models/InvoiceItem.model.js");
const Category = require("../models/Category.model.js");

const addAllInvoiceItems = async (invoiceItems) => {
    await InvoiceItem.bulkCreate(invoiceItems);
}

const getInvoiceItemsToDate = async (toDate) => {
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
            [fn('sum', literal(`CASE WHEN type = 'cash' THEN qty WHEN type = 'return' THEN qty * -1 ELSE 0 END`)), 'qty'],
        ],
        group: ['itemId']
    });
}

const getInvoiceItemsToDateByUserId = async (toDate, userId) => {
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
            },
            createdBy: userId,
        },
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


module.exports = Object.freeze({
    addAllInvoiceItems,
    getInvoiceItemsToDate,
    getInvoiceItemsToDateByUserId,
    getInvoiceItemsByDateAndUserId,
})