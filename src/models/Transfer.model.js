const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const User = require('./User.model');

const {
    TO,
    FROM,
} = require('../configs/constant.config.js');

const Transfer = db.define('Transfer', {
    transferId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'userId'
        }
    },
    type: {
        type: DataTypes.ENUM({
            values: [TO, FROM]
        }),
        defaultValue: TO,
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

Transfer.belongsTo(User, {
    as: 'User',
    foreignKey: 'userId'
});

Transfer.belongsTo(User, {
    as: 'CreatedBy',
    foreignKey: 'createdBy'
});
// await Transfer.sync();

module.exports = Transfer;
