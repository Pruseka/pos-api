const { Op, fn } = require("sequelize");

const Expense = require("../models/Expense.model.js");

const createExpense = async (expense) => {
    await Expense.create(expense);
}

const updateExpense = async(expenseId, expense) => {
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

const getTotalAmountByDate = async (fromDate, toDate) => {
    const temp = new Date(toDate);
    temp.setDate(temp.getDate() + 1);
    const totalAmount = await Expense.findAll({
        where: {
            createdAt: {
                [Op.gte]: fromDate,
                [Op.lt]: temp
            }
        },
        attributes: [
            [fn('sum', 'amount'), 'totalAmount'],
        ]
    });
    return totalAmount[0].get({ plain: true });
}

module.exports = Object.freeze({
    createExpense,
    updateExpense,
    getExpensesByDate,
    getTotalAmountByDate,
})