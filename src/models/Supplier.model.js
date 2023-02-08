const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Supplier = db.define('Supplier', {
    supplierId: {
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
    phone: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    address: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
});

// await Supplier.sync();

module.exports = Supplier;
