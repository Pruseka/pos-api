const { Op } = require("sequelize");

const User = require("../models/User.model.js");
const Customer = require('../models/Customer.model');
const CustomerTransfer = require("../models/CustomerTransfer.model.js");
const CustomerTransferItem = require("../models/CustomerTransferItem.model.js");
const Item = require("../models/Item.model.js");
const Category = require("../models/Category.model.js");

const createCustomerTransfer = async (customertransfer) => {
    return await CustomerTransfer.create(customertransfer);
}

const getCustomerTransfersByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await CustomerTransfer.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        include: [
            {
                model: Customer,
                as: 'Customer',
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

module.exports = Object.freeze({
    createCustomerTransfer,
    getCustomerTransfersByDate,
})