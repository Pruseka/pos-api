const SupplyItemService = require("../services/SupplyItem.service.js");
const InvoiceItemService = require("../services/InvoiceItem.service.js");
const ItemService = require("../services/Item.service.js");

const StockValidator = require("../validators/Stock.validator.js");

const {
    successRes
} = require("../utils/response.utils.js");

const createItemMap = (items) => {
    const itemMap = new Map();
    items.forEach(item => {
        itemMap.set(item.itemId, {
            qty: item.qty,
            amount: item.amount,
        });
    });
    return itemMap;
}

const getClosingStockToDate = async (req, res, next) => {
    try {
        const validation = StockValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        };
        const { to } = validation.value;
        const toDate = new Date(to);
        const _items = await ItemService.getAllItems();
        const invoiceItems = await InvoiceItemService.getInvoiceItemsToDate(toDate);
        const supplyItems = await SupplyItemService.getSupplyItemsToDate(toDate);
        const invoiceItemMap = createItemMap(invoiceItems);
        const supplyItemMap = createItemMap(supplyItems);
        const items = _items.map(item => {
            const invoiceQty = invoiceItemMap.get(item.itemId)?.qty | 0;
            const supplyQty = supplyItemMap.get(item.itemId)?.qty | 0;
            return {
                itemId: item.itemId,
                name: item.name,
                qty: supplyQty - invoiceQty
            };
        });
        successRes(res, null, items);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    getClosingStockToDate,
})
