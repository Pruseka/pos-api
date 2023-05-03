const SupplyItemService = require("../services/SupplyItem.service");
const TransferItemService = require('../services/TransferItem.service');
const InvoiceItemService = require("../services/InvoiceItem.service");
const ItemService = require("../services/Item.service.js");
const UserService = require("../services/User.service");

const WarehouseValidator = require("../validators/Warehouse.validator");

const {
    successRes
} = require("../utils/response.utils.js");
const { CASH, CREDIT, RETURN, FROM, DAMAGE } = require("../configs/constant.config");

const createItemMap = (items) => {
    const itemMap = new Map();
    items.forEach(item => {
        itemMap.set(item.itemId, item.qty);
    });
    return itemMap;
}

const getClosingToDate = async (req, res, next) => {
    try {
        const validation = WarehouseValidator.getToDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        };
        const { to } = validation.value;
        const toDate = new Date(to);
        const _items = await ItemService.getAllItems();
        const supplyItems = await SupplyItemService.getSupplyItemsToDate(toDate);
        const transferItems = await TransferItemService.getTransferItemsToDate(toDate);
        const vanSalesIds = (await UserService.getAllVanSales()).map(vanSale => vanSale.userId);
        const invoiceItems = await InvoiceItemService.getInvoiceItemsToDateAndExcludedUserIds(toDate, vanSalesIds);
        const transferItemMap = createItemMap(transferItems);
        const supplyItemMap = createItemMap(supplyItems);
        const invoiceItemMap = createItemMap(invoiceItems);
        const items = _items.map(item => {
            const itemId = item.itemId;
            const transferQty = transferItemMap.get(itemId) ?? 0;
            const supplyQty = supplyItemMap.get(itemId) ?? 0;
            const invoiceQty = invoiceItemMap.get(itemId) ?? 0;
            return {
                itemId: item.itemId,
                code: item.code,
                name: item.name,
                category: item.Category.name,
                qty: supplyQty - transferQty - invoiceQty
            };
        });
        successRes(res, null, items);
    } catch (err) {
        next(err);
    }
}

const getQtyFromSupply = (type, qty) => {
    if (type === CASH || type === CREDIT) {
        return qty;
    }
    if (type === RETURN) {
        return -1 * qty;
    }
    return 0;
}

const getSupplyRecordByDate = async (req, res, next) => {
    try {
        const validation = WarehouseValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _supplyItems = await SupplyItemService.getSupplyItemsByDate(fromDate, toDate);
        const supplyItems = _supplyItems.map(_supplyItem => {
            const { Supply, Item, price, amount, ...supplyItem } = _supplyItem.get({ plain: true });
            return {
                supplier: Supply.supplier,
                code: Item.code,
                name: Item.name,
                category: Item.Category.name,
                ...supplyItem
            }
        });
        const inRecordMap = new Map();
        supplyItems.forEach(_supplyItem => {
            const { itemId, code, name, category, ...supplyItem } = _supplyItem;
            const qty = getQtyFromSupply(supplyItem.type, supplyItem.qty);
            const inRecord = inRecordMap.get(itemId);
            if (!inRecord) {
                inRecordMap.set(itemId, {
                    itemId,
                    code,
                    name,
                    category,
                    qty,
                    list: [supplyItem],
                })
            } else {
                inRecord.qty += qty;
                inRecord.list.push(supplyItem);
            }
        });
        const inRecords = Array.from(inRecordMap.values());
        successRes(res, null, inRecords);
    } catch (err) {
        next(err);
    }
}

const getQtyFromTransfer = (type, qty) => {
    if (type === FROM) {
        return -1 * qty;
    }
    return qty;
}

const getTransferRecordByDate = async (req, res, next) => {
    try {
        const validation = WarehouseValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _transferItems = await TransferItemService.getTransferItemsByDate(fromDate, toDate);
        const transferItems = _transferItems.map(_transferItem => {
            const { User, Item, userId, ...transferItem } = _transferItem.get({ plain: true });
            return {
                user: User.name,
                code: Item.code,
                name: Item.name,
                category: Item.Category.name,
                ...transferItem
            }
        });

        const outRecordMap = new Map();
        transferItems.forEach(_transferItem => {
            const { itemId, code, name, category, ...transferItem } = _transferItem;
            const qty = getQtyFromTransfer(transferItem.type, transferItem.qty);
            const outRecord = outRecordMap.get(itemId);
            if (!outRecord) {
                outRecordMap.set(itemId, {
                    itemId,
                    code,
                    name,
                    category,
                    qty,
                    list: [transferItem],
                })
            } else {
                outRecord.qty += qty;
                outRecord.list.push(transferItem);
            }
        });
        const outRecords = Array.from(outRecordMap.values());
        successRes(res, null, outRecords);
    } catch (err) {
        next(err);
    }
}

const getQtyFromInvoice = (type, qty) => {
    if (type === CASH || type === CREDIT || type === DAMAGE) {
        return qty;
    }
    if (type === RETURN) {
        return qty * -1;
    }
    return 0;
}

const getInvoiceRecordByDate = async (req, res, next) => {
    try {
        const validation = WarehouseValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const vanSalesIds = (await UserService.getAllVanSales()).map(vanSale => vanSale.userId);
        const _invoiceItems = await InvoiceItemService.getInvoiceItemsByDateAndExcludedUserIds(fromDate, toDate, vanSalesIds);
        const invoiceItems = _invoiceItems.map(_invoiceItem => {
            const { Invoice, Item, price, amount, ...invoiceItem } = _invoiceItem.get({ plain: true });
            return {
                customer: Invoice.customer,
                code: Item.code,
                name: Item.name,
                category: Item.Category.name,
                ...invoiceItem
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
    getSupplyRecordByDate,
    getTransferRecordByDate,
    getInvoiceRecordByDate,
})
