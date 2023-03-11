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
    BadRequestError
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
        const customer = await UserService.getUserById(customerId);
        if (!customer) {
            throw createError(BadRequestError, CUSTOMER_NOT_EXIST);
        }
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _transferItems = await CustomerTransferItemService.getCustomerTransferItemsByDateAndCustomerId(fromDate, toDate, customerId);
        const transferItems = _transferItems.map(_transferItem => {
            const { Item, userId, ...supplyItem } = _transferItem.get({ plain: true });
            return {
                name: Item.name,
                ...supplyItem
            }
        })
        successRes(res, null, transferItems);
    } catch (err) {
        next(err);
    }
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
        if(!user) {
            throw createError(BadRequestError, USER_NOT_EXIST);
        }
        const _invoiceItems= await InvoiceItemService.getInvoiceItemsByDateAndUserId(fromDate, toDate, userId);
        const invoiceItems = _invoiceItems.map(_invoiceItem => {
            const { Invoice, Item, price, amount, ...transferItem } = _invoiceItem.get({ plain: true });
            return {
                customer: Invoice.customer,
                name: Item.name,
                ...transferItem
            }
        })
        successRes(res, null, invoiceItems);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    getClosingToDate,
    getInRecordByDate,
    getOutRecordByDate,
})
