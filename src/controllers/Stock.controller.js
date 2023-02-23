const TransferItemService = require('../services/TransferItem.service');
const InvoiceItemService = require("../services/InvoiceItem.service");
const UserService = require('../services/User.service');
const ItemService = require("../services/Item.service.js");

const StockValidator = require("../validators/Stock.validator.js");

const {
    USER_NOT_EXIST,
} = require('../configs/message.config');

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
                name: item.name,
                qty: transferQty - invoiceQty
            };
        });
        successRes(res, null, items);
    } catch (err) {
        next(err);
    }
}

const getInRecordByDate = async (req, res, next) => {
    try {
        const validation = WarehouseValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to, userId } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _supplyItems = await SupplyItemService.getSupplyItemsByDate(fromDate, toDate);
        const supplyItems = _supplyItems.map(_supplyItem => {
            const { Supply, Item, price, amount, ...supplyItem } = _supplyItem.get({ plain: true });
            return {
                supplier: Supply.supplier,
                name: Item.name,
                ...supplyItem
            }
        })
        successRes(res, null, supplyItems);
    } catch (err) {
        next(err);
    }
}

const getOutRecordByDate = async (req, res, next) => {
    try {
        const validation = WarehouseValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to, userId } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _transferItems = await TransferItemService.getTransferItemsByDate(fromDate, toDate);
        const transferItems = _transferItems.map(_transferItem => {
            const { User, Item, userId, price, amount, ...transferItem } = _transferItem.get({ plain: true });
            return {
                user: User.name,
                name: Item.name,
                ...transferItem
            }
        })
        successRes(res, null, transferItems);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    getClosingToDate,
})
