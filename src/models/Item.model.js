const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Category = require('./Category.model');

const Item = db.define('Item', {
    itemId: {
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
    categoryId: {
        type: DataTypes.UUID,
        references: {
            model: Category,
            key: 'categoryId'
        }
    },
    purchasingPrice: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
    retailPrice: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
    wholesalesPrice: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
});

Item.belongsTo(Category, {
    foreignKey: {
        name: 'categoryId'
    }
});

// await Item.sync();

module.exports = Item;
