const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const {
    RETAIL,
    WHOLESALES,
} = require('../configs/constant.config');

const Customer = db.define('Customer', {
    customerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM({
            values: [RETAIL, WHOLESALES]
        }),
        defaultValue: RETAIL,
    },
    phone: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    address: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
});

// await Customer.sync();

module.exports = Customer;
