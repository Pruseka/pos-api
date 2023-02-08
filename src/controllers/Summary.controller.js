const BaseSubscriptionService = require("../services/BaseSubscription.service.js");
const ClassSubscriptionService = require("../services/ClassSubscription.service.js");
const TrainerSubpscriptionService = require("../services/TrainerSubscription.service.js");
const InvoiceService = require("../services/Invoice.service.js");
const SupplyService = require("../services/Supply.service.js");
const ExpenseService = require("../services/Expense.service.js");

const SummaryValidator = require("../validators/Summary.validator.js");

const {
    successRes
} = require("../utils/response.utils.js");

const getSummaryByDate = async (req, res, next) => {
    try {
        const validation = SummaryValidator.getValidatorByDate.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const totalBaseSubscription = await BaseSubscriptionService.getTotalBaseSubscriptionByDate(fromDate, toDate);
        const totalClassSubscription = await ClassSubscriptionService.getTotalClassSubscriptionByDate(fromDate, toDate);
        const totalTrainerSubscription = await TrainerSubpscriptionService.getTotalTrainerSubscriptionByDate(fromDate, toDate);
        const totalInvoices = await InvoiceService.getTotalAmountByDate(fromDate, toDate);
        const totalSupplies = await SupplyService.getTotalAmountByDate(fromDate, toDate);
        const totalExpenses = await ExpenseService.getTotalAmountByDate(fromDate, toDate);
        const summary = {
            baseSubscription: {
                amount: totalBaseSubscription.totalAmount | 0,
                discount: totalBaseSubscription.totalDiscount | 0,
            },
            classSubscription: {
                amount: totalClassSubscription.totalAmount | 0,
                discount: totalClassSubscription.totalDiscount | 0,
            },
            trainerSubscription: {
                amount: totalTrainerSubscription.totalAmount | 0,
                discount: totalTrainerSubscription.totalDiscount | 0,
            },
            invoiceTotal: totalInvoices.totalAmount | 0,
            supplyTotal: totalSupplies.totalAmount | 0,
            expenseTotal: totalExpenses.totalAmount | 0,
        };
        summary.subscriptionTotal = summary.baseSubscription.amount - summary.baseSubscription.discount +
            summary.classSubscription.amount - summary.classSubscription.discount +
            summary.trainerSubscription.amount - summary.trainerSubscription.discount;
        successRes(res, null, summary);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    getSummaryByDate,
})
