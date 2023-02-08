const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const User = require('./User.model');

const {
    CASH,
    CREDIT,
    RETURN,
    CANCEL,
    DAMAGE,
    UNPAID,
    PAID,
    WHOLESALES,
    RETAIL,
} = require('../configs/constant.config.js');

const Invoice = db.define('Invoice', {
    invoiceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customer: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    customerType: {
        type: DataTypes.ENUM({
            values: [RETAIL, WHOLESALES]
        }),
        defaultValue: RETAIL,
    },
    type: {
        type: DataTypes.ENUM({
            values: [CASH, CREDIT, RETURN, CANCEL, DAMAGE]
        }),
        defaultValue: CASH,
    },
    status: {
        type: DataTypes.ENUM({
            values: [UNPAID, PAID]
        }),
        defaultValue: PAID,
    },
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    createdBy: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'userId'
        }
    },
    receivedBy: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'userId',
        },
    },
    receivedAt: {
        type: DataTypes.DATE,
    },
}, {
    initialAutoIncrement: 1,
    updatedAt: false,
});

Invoice.belongsTo(User, {
    as: 'CreatedBy',
    foreignKey:'createdBy'
});

Invoice.belongsTo(User, {
    as: 'ReceviedBy',
    foreignKey: 'receivedBy'
});
// await Invoice.sync();

module.exports = Invoice;
