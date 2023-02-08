const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Customer = require('./Customer.model');
const User = require('./User.model');

const {
    IN,
    OUT,
} = require('../configs/constant.config.js');

const CustomerTransfer = db.define('CustomerTransfer', {
    customerTransferId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customerId: {
        type: DataTypes.UUID,
        references: {
            model: Customer,
            key: 'customerId'
        }
    },
    type: {
        type: DataTypes.ENUM({
            values: [IN, OUT]
        }),
        defaultValue: IN,
    },
    createdBy: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'userId'
        }
    },
}, {
    initialAutoIncrement: 1,
    updatedAt: false,
});

CustomerTransfer.belongsTo(Customer, {
    foreignKey: {
        name: 'customerId'
    }
});

CustomerTransfer.belongsTo(User, {
    as: 'CreatedBy',
    foreignKey: 'createdBy'
});
// await CustomerTransfer.sync();

module.exports = CustomerTransfer;
