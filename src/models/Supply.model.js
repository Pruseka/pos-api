const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const User = require("./User.model");

const {
    CASH,
    CREDIT,
    RETURN,
    CANCEL,
    PAID,
    UNPAID
} = require('../configs/constant.config.js');

const Supply = db.define('Supply', {
    supplyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    supplier: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    type: {
        type: DataTypes.ENUM({
            values: [CASH, CREDIT, RETURN, CANCEL]
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
    withdrawnBy: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'userId',
        },
    },
    withdrawnAt: {
        type: DataTypes.DATE,
    },
}, {
    initialAutoIncrement: 1,
    updatedAt: false,
});

Supply.belongsTo(User, {
    as: 'CreatedBy',
    foreignKey: 'createdBy'
});

Supply.belongsTo(User, {
    as: 'WithdrawnBy',
    foreignKey: 'withdrawnBy'
});

// await Supply.sync();

module.exports = Supply;
