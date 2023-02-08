const ExpenseService = require("../services/Expense.service.js");

const ExpenseValidator = require("../validators/Expense.validator.js");

const {
    ADD_EXPENSE_SUCCESS,
    UPDATE_EXPENSE_SUCCESS,
} = require("../configs/message.config.js");

const {
    successRes
} = require("../utils/response.utils.js");

const addExpense = async (req, res, next) => {
    try {
        const validation = ExpenseValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        await ExpenseService.createExpense(validation.value);
        successRes(res, ADD_EXPENSE_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const updateExpense = async (req, res, next) => {
    try {
        const validation = ExpenseValidator.updateValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { expenseId, ...expense } = validation.value;
        await ExpenseService.updateExpense(expenseId, expense);
        successRes(res, UPDATE_EXPENSE_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getExpenseByDate = async (req, res, next) => {
    try {
        const validation = ExpenseValidator.getValidatorByDate.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const expenses = await ExpenseService.getExpensesByDate(fromDate, toDate);
        successRes(res, null, expenses);
    } catch (err) {
        next(err)
    }
}

module.exports = Object.freeze({
    addExpense,
    updateExpense,
    getExpenseByDate,
})