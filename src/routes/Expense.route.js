const { Router } = require("express");
const {
    addExpense,
    updateExpense,
    getExpenseByDate,
} = require("../controllers/Expense.controller.js");

const expenseRoute = Router();

expenseRoute.post('/', addExpense);
expenseRoute.put('/', updateExpense);
expenseRoute.get('/', getExpenseByDate);

module.exports = expenseRoute;