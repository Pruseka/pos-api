const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const {
    ADMIN,
    SALES_ADMIN,
    VAN_SALES,
} = require('../configs/constant.config');

const User = db.define('User', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM({
            values: [ADMIN, SALES_ADMIN, VAN_SALES]
        }),
        defaultValue: SALES_ADMIN,
    },
    enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

// await User.sync();

module.exports = User;
