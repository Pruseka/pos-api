const { fn, Op, literal } = require("sequelize");

const InvoiceItem = require("../models/InvoiceItem.model.js");

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

module.exports = Object.freeze({
    addAllInvoiceItems,
    getInvoiceItemsToDate,
})