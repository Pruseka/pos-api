const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Invoice = require("./Invoice.model.js");
const Item = require("./Item.model.js");

const {
    CASH,
    CREDIT,
    RETURN,
    CANCEL,
    DAMAGE,
} = require("../configs/constant.config.js");

const InvoiceItem = db.define('InvoiceItem', {
    invoiceItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    invoiceId: {
        type: DataTypes.UUID,
    },
    itemId: {
        type: DataTypes.UUID,
    },
    type: {
        type: DataTypes.ENUM({
            values: [CASH, CREDIT, RETURN, CANCEL, DAMAGE]
        }),
        defaultValue: CASH,
    },
    qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    updatedAt: false,
});

Invoice.hasMany(InvoiceItem, {
    foreignKey: {
        name: 'invoiceId'
    }
});

InvoiceItem.belongsTo(Item, {
    foreignKey: {
        name: 'itemId'
    }
});

// await InvoiceItem.sync();

module.exports = InvoiceItem;
