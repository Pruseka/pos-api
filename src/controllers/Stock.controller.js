const TransferItemService = require('../services/TransferItem.service');
const InvoiceItemService = require("../services/InvoiceItem.service");
const UserService = require('../services/User.service');
const ItemService = require("../services/Item.service.js");

const StockValidator = require("../validators/Stock.validator.js");

const {
    USER_NOT_EXIST,
} = require('../configs/message.config');

const {
    createError
} = require('../utils/error.utils');

const {
    successRes
} = require("../utils/response.utils.js");

const {
    BadRequestError, TO, CASH, CREDIT, DAMAGE, RETURN
} = require('../configs/constant.config');

const createItemMap = (items) => {
    const itemMap = new Map();
    items.forEach(item => {
        itemMap.set(item.itemId, item.qty);
    });
    return itemMap;
}

const getClosingToDate = async (req, res, next) => {
    try {
        const validation = StockValidator.getToDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        };
        const { to, userId } = validation.value;
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw createError(BadRequestError, USER_NOT_EXIST);
        }
        const toDate = new Date(to);
        const _items = await ItemService.getAllItems();
        const tranferItems = await TransferItemService.getTransferItemsToDateByUserId(toDate, userId);
        const invoiceItems = await InvoiceItemService.getInvoiceItemsToDate(toDate);
        const transferItemMap = createItemMap(tranferItems);
        const invoiceItemMap = createItemMap(invoiceItems);
        const items = _items.map(item => {
            const invoiceQty = invoiceItemMap.get(item.itemId) ?? 0;
            const transferQty = transferItemMap.get(item.itemId) ?? 0;
            return {
                itemId: item.itemId,
                code: item.code,
                name: item.name,
                category: item.Category.name,
                qty: transferQty - invoiceQty
            };
        });
        successRes(res, null, items);
    } catch (err) {
        next(err);
    }
}

const getQtyFromTransfer = (type, qty) => {
    if (type === TO) {
        return qty;
    }
    return qty * -1;
}

const getInRecordByDate = async (req, res, next) => {
    try {
        const validation = StockValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to, userId } = validation.value;
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw createError(BadRequestError, USER_NOT_EXIST);
        }
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _transferItems = await TransferItemService.getTransferItemsByDateAndUserId(fromDate, toDate, userId);
        const transferItems = _transferItems.map(_transferItem => {
            const { Item, userId, ...supplyItem } = _transferItem.get({ plain: true });
            return {
                name: Item.name,
                code: Item.code,
                category: Item.Category.name,
                ...supplyItem
            }
        });
        const inRecordMap = new Map();
        transferItems.forEach(_transferItem => {
            const { itemId, code, name, category, ...transferItem } = _transferItem;
            const qty = getQtyFromTransfer(transferItem.type, transferItem.qty);
            const inRecord = inRecordMap.get(itemId);
            if (!inRecord) {
                inRecordMap.set(itemId, {
                    itemId,
                    code,
                    name,
                    category,
                    qty,
                    list: [transferItem],
                })
            } else {
                inRecord.qty += qty;
                inRecord.list.push(transferItem);
            }
        });
        const inRecords = Array.from(inRecordMap.values());
        successRes(res, null, inRecords);
    } catch (err) {
        next(err);
    }
}

const getQtyFromInvoice = (type, qty) => {
    if( type === CASH || type === CREDIT || type === DAMAGE) {
        return qty;
    }
    if(type === RETURN) {
        return qty * -1;
    }
    return 0;
}

const getOutRecordByDate = async (req, res, next) => {
    try {
        const validation = StockValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to, userId } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw createError(BadRequestError, USER_NOT_EXIST);
        }
        const _invoiceItems = await InvoiceItemService.getInvoiceItemsByDateAndUserId(fromDate, toDate, userId);
        const invoiceItems = _invoiceItems.map(_invoiceItem => {
            const { Invoice, Item, price, amount, ...transferItem } = _invoiceItem.get({ plain: true });
            return {
                customer: Invoice.customer,
                code: Item.code,
                name: Item.name,
                category: Item.Category.name,
                ...transferItem
            }
        });
        const outRecordMap = new Map();
        invoiceItems.forEach(_invoiceItem => {
            const { itemId, code, name, category, ...invoiceItem } = _invoiceItem;
            const qty = getQtyFromInvoice(invoiceItem.type, invoiceItem.qty);
            const outRecord = outRecordMap.get(itemId);
            if (!outRecord) {
                outRecordMap.set(itemId, {
                    itemId,
                    code,
                    name,
                    category,
                    qty,
                    list: [invoiceItem],
                })
            } else {
                outRecord.qty += qty;
                outRecord.list.push(invoiceItem);
            }
        });
        const outRecords = Array.from(outRecordMap.values());
        successRes(res, null, outRecords);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    getClosingToDate,
    getInRecordByDate,
    getOutRecordByDate,
})
