const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const CustomerTransfer = require("./CustomerTransfer.model.js");
const Customer = require("./Customer.model");
const Item = require("./Item.model.js");

const {
    IN,
    OUT,
} = require("../configs/constant.config.js");

const CustomerTransferItem = db.define('CustomerTransferItem', {
    customerTransferItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    customerTransferId: {
        type: DataTypes.UUID,
    },
    customerId: {
        type: DataTypes.UUID,
    },
    itemId: {
        type: DataTypes.UUID,
    },
    type: {
        type: DataTypes.ENUM({
            values: [IN, OUT]
        }),
        defaultValue: IN,
    },
    qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

Customer.hasMany(CustomerTransferItem, {
    foreignKey: {
        name: 'customerId',
    }
});

CustomerTransfer.hasMany(CustomerTransferItem, {
    foreignKey: {
        name: 'customerTransferId'
    }
});

CustomerTransferItem.belongsTo(Item, {
    foreignKey: {
        name: 'itemId'
    }
});

// await CustomerTransferItem.sync();

module.exports = CustomerTransferItem;
