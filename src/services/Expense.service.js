const { Op, fn } = require("sequelize");

const Expense = require("../models/Expense.model.js");

const createExpense = async (expense) => {
    await Expense.create(expense);
}

const updateExpense = async (expenseId, expense) => {
    await Expense.update(expense, {
        where: { expenseId }
    })
}

const getExpensesByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    return await Expense.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
    })
}

const getAmountByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    const amount = await Expense.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        attributes: [
            [fn('sum', 'amount'), 'amount'],
        ]
    });
    if (amount.length < 1) {
        return 0;
    }
    const totalAmount = amount[0].get({ plain: true });
    return totalAmount.amount ? totalAmount.amount : 0;
}

module.exports = Object.freeze({
    createExpense,
    updateExpense,
    getExpensesByDate,
    getAmountByDate,
})