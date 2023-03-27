const InvoiceItemService = require('../services/InvoiceItem.service');
const SupplyItemService = require('../services/SupplyItem.service');
const SupplyService = require('../services/Supply.service');
const InvoiceService = require('../services/Invoice.service');
const ItemService = require('../services/Item.service');

const SummaryValidator = require("../validators/Summary.validator.js");

const {
    successRes
} = require("../utils/response.utils.js");
const ExpenseService = require('../services/Expense.service');

const createItemMap = (items) => {
    const itemMap = new Map();
    items.forEach(item => {
        itemMap.set(item.itemId, item.qty);
    });
    return itemMap;
}

const createPriceMap = (prices) => {
    const priceMap = new Map();
    prices.forEach(price => {
        priceMap.set(price.itemId, price.price);
    });
    return priceMap;
}

const getclosingStockToDate = async (toDate, items) => {
    const invoiceItems = await InvoiceItemService.getInvoiceItemsToDate(toDate);
    const supplyItems = await SupplyItemService.getSupplyItemsToDate(toDate);
    const invoiceItemMap = createItemMap(invoiceItems);
    const supplyItemMap = createItemMap(supplyItems);
    return items.map(item => {
        const itemId = item.itemId;
        const supplyQty = supplyItemMap.get(itemId) ?? 0;
        const invoiceQty = invoiceItemMap.get(itemId) ?? 0;
        return {
            itemId: item.itemId,
            qty: supplyQty - invoiceQty
        };
    })
}

const getOpeningBalance = (items, prices, openingStock) => {
    let openingBalance = 0;
    const priceMap = createPriceMap(prices);
    items.forEach((item, index) => {
        const itemId = item.itemId;
        const price = priceMap.get(itemId) ?? item.purchasingPrice;
        openingBalance += (price * openingStock[index].qty);
    });
    return openingBalance;
}

const getClosingBalance = (items, closingStock) => {
    let closingBalance = 0;
    items.forEach((item, index) => {
        closingBalance += (item.purchasingPrice * closingStock[index].qty);
    });
    return closingBalance;

}

const getSummaryByDate = async (req, res, next) => {
    try {
        const validation = SummaryValidator.getValidatorByDate.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        fromDate.setDate(fromDate.getDate() - 1);
        const items = await ItemService.getAllItems();
        const openingStock = await getclosingStockToDate(fromDate, items);
        const prices = await SupplyItemService.getPurchasingPriceToDate(fromDate);
        const openingBalance = getOpeningBalance(items, prices, openingStock);

        const closingStock = await getclosingStockToDate(toDate, items);
        const closingBalance = getClosingBalance(items, closingStock);

        fromDate.setDate(fromDate.getDate() + 1);
        const purchasingAmount = await SupplyService.getAmountByDate(fromDate, toDate);
        const sellingAmount = await InvoiceService.getAmountByDate(fromDate, toDate);
        const expenseAmount = await ExpenseService.getAmountByDate(fromDate, toDate);
        const cogs = openingBalance + purchasingAmount - closingBalance;
        const grossProfit = sellingAmount - cogs;
        const netProfit = grossProfit - expenseAmount;
        const cashIn = await InvoiceService.getCashInByDate(fromDate, toDate);
        const cashOut = await SupplyService.getCashOutByDate(fromDate, toDate);
        const balance = cashIn - cashOut - expenseAmount;
        const summary = {
            openingBalance,
            closingBalance,
            purchasingAmount,
            sellingAmount,
            cogs,
            grossProfit,
            expenseAmount,
            netProfit,
            cashIn,
            cashOut,
            balance,
        }
        successRes(res, null, summary);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    getSummaryByDate,
})
