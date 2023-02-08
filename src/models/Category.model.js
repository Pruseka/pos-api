const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Category = db.define('Category', {
    categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false
});

// await Category.sync();

module.exports = Category;
