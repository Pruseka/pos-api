const CustomerTransferItemService = require('../services/CustomerTransferItem.service');
const CustomerService = require('../services/Customer.service');
const ItemService = require('../services/Item.service');

const CustomerStockValidator = require("../validators/CustomerStock.validator");

const {
    CUSTOMER_NOT_EXIST,
} = require('../configs/message.config');

const {
    createError
} = require('../utils/error.utils');

const {
    successRes
} = require("../utils/response.utils.js");

const {
    BadRequestError, IN, OUT
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
        const validation = CustomerStockValidator.getToDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        };
        const { to, customerId } = validation.value;
        const customer = await CustomerService.getCustomerById(customerId);
        if (!customer) {
            throw createError(BadRequestError, CUSTOMER_NOT_EXIST);
        }
        const toDate = new Date(to);
        const _items = await ItemService.getAllItems();
        const transferItems = await CustomerTransferItemService.getCustomerTransferItemsToDate(toDate);
        const transferItemMap = createItemMap(transferItems);
        const items = _items.map(item => {
            const transferQty = transferItemMap.get(item.itemId) ?? 0;
            return {
                itemId: item.itemId,
                code: item.code,
                name: item.name,
                category: item.Category.name,
                qty: transferQty
            };
        });
        successRes(res, null, items);
    } catch (err) {
        next(err);
    }
}

const getInRecordByDate = async (req, res, next) => {
    try {
        const validation = CustomerStockValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to, customerId } = validation.value;
        const customer = await CustomerService.getCustomerById(customerId);
        if (!customer) {
            throw createError(BadRequestError, CUSTOMER_NOT_EXIST);
        }
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _transferItems = await CustomerTransferItemService.getCustomerTransferItemsByDateAndCustomerId(fromDate, toDate, customerId);
        const transferItems = _transferItems.map(_transferItem => {
            const { Item, userId, ...transferItem } = _transferItem.get({ plain: true });
            return {
                code: Item.code,
                name: Item.name,
                category: Item.Category.name,
                ...transferItem
            }
        });
        const inItems = transferItems.filter(transferItem => transferItem.type === IN);
        const inRecordMap = new Map();
        inItems.forEach(_transferItem => {
            const { itemId, code, name, category, ...transferItem } = _transferItem;
            const inRecord = inRecordMap.get(itemId);
            if (!inRecord) {
                inRecordMap.set(itemId, {
                    itemId,
                    code,
                    name,
                    category,
                    qty: transferItem.qty,
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

const getOutRecordByDate = async (req, res, next) => {
    try {
        const validation = CustomerStockValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to, customerId } = validation.value;
        const customer = await CustomerService.getCustomerById(customerId);
        if (!customer) {
            throw createError(BadRequestError, CUSTOMER_NOT_EXIST);
        }
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _transferItems = await CustomerTransferItemService.getCustomerTransferItemsByDateAndCustomerId(fromDate, toDate, customerId);
        const transferItems = _transferItems.map(_transferItem => {
            const { Item, userId, ...transferItem } = _transferItem.get({ plain: true });
            return {
                code: Item.code,
                name: Item.name,
                category: Item.Category.name,
                ...transferItem
            }
        });
        const outItems = transferItems.filter(transferItem => transferItem.type === OUT);
        const outRecordMap = new Map();
        outItems.forEach(_transferItem => {
            const { itemId, code, name, category, ...transferItem } = _transferItem;
            const outRecord = outRecordMap.get(itemId);
            if (!outRecord) {
                outRecordMap.set(itemId, {
                    itemId,
                    code,
                    name,
                    category,
                    qty: transferItem.qty,
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

module.exports = Object.freeze({
    getClosingToDate,
    getInRecordByDate,
    getOutRecordByDate,
})
