const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Supply = require("./Supply.model.js");
const Item = require("./Item.model.js");

const {
    CASH,
    CREDIT,
    RETURN,
    CANCEL,
} = require("../configs/constant.config.js");

const SupplyItem = db.define('SupplyItem', {
    supplyItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    supplyId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    itemId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM({
            values: [CASH, CREDIT, RETURN, CANCEL]
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
        type: DataTypes.NUMBER,
        defaultValue: 0,
    }
}, {
    updatedAt: false,
});

Supply.hasMany(SupplyItem, {
    foreignKey: {
        name: 'supplyId'
    }
});

SupplyItem.belongsTo(Supply, {
    foreignKey: {
        name: 'supplyId'
    }
})

SupplyItem.belongsTo(Item, {
    foreignKey: {
        name: 'itemId'
    }
});

// await SupplyItem.sync();

module.exports = SupplyItem;
