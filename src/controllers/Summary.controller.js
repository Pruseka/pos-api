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
        successRes(res, null, summary);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    getSummaryByDate,
})
