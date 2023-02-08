const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Transfer = require("./Transfer.model.js");
const User = require("./User.model");
const Item = require("./Item.model.js");

const {
    TO,
    FROM,
} = require("../configs/constant.config.js");

const TransferItem = db.define('TransferItem', {
    transferItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    transferId: {
        type: DataTypes.UUID,
    },
    userId: {
        type: DataTypes.UUID,
    },
    itemId: {
        type: DataTypes.UUID,
    },
    type: {
        type: DataTypes.ENUM({
            values: [TO, FROM]
        }),
        defaultValue: TO,
    },
    qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

User.hasMany(TransferItem, {
    foreignKey: {
        name: 'userId',
    }
});

Transfer.hasMany(TransferItem, {
    foreignKey: {
        name: 'transferId'
    }
});

TransferItem.belongsTo(Item, {
    foreignKey: {
        name: 'itemId'
    }
});

// await TransferItem.sync();

module.exports = TransferItem;
