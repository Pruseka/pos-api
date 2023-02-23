const SupplyItemService = require("../services/SupplyItem.service");
const TransferItemService = require('../services/TransferItem.service')
const ItemService = require("../services/Item.service.js");

const WarehouseValidator = require("../validators/Warehouse.validator");

const {
    successRes
} = require("../utils/response.utils.js");

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
        const transferItemMap = createItemMap(transferItems);
        const supplyItemMap = createItemMap(supplyItems);
        const items = _items.map(item => {
            const transferQty = transferItemMap.get(item.itemId) ?? 0;
            const supplyQty = supplyItemMap.get(item.itemId) ?? 0;
            return {
                itemId: item.itemId,
                name: item.name,
                qty: supplyQty - transferQty
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
        const { from, to } = validation.value;
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
        const { from, to } = validation.value;
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
    getInRecordByDate,
    getOutRecordByDate,
})
