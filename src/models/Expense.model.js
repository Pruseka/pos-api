
const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Expense = db.define('Expense', {
    expenseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    amount: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
});

// await Expense.sync();

module.exports = Expense;
