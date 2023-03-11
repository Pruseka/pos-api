const Supplieservice = require("../services/Supply.service.js");
const ItemService = require("../services/Item.service.js");
const SupplyItemService = require("../services/SupplyItem.service.js");

const SupplyValidator = require("../validators/Supply.validator.js");

const {
    successRes
} = require("../utils/response.utils.js");

const {
    ADD_SUPPLY_SUCCESS
} = require("../configs/message.config.js");


const {
    CREDIT,
    UNPAID,
    PAID,
    ADMIN,
} = require("../configs/constant.config.js");

const createItemMap = (items) => {
    const itemMap = new Map();
    items.forEach(item => {
        const temp = itemMap.get(item.itemId);
        if (temp) {
            itemMap.set(item.itemId, temp + item.qty);
        } else {
            itemMap.set(item.itemId, item.qty);
        }
    });
    return itemMap;
}

const makeSupplyItems = (type, dbItems, itemMap) => {

    return dbItems.map(item => {
        const qty = itemMap.get(item.itemId) ?? 0;
        const price = item.purchasingPrice
        const amount = qty * price;
        return {
            itemId: item.itemId,
            type, qty, price, amount,
        }
    })
}

const getTotalAmount = (supplyItems) => {
    let totalAmount = 0;
    supplyItems.forEach(item => {
        totalAmount += item.amount;
    });
    return totalAmount;
}

const getSuppliestatus = (type) => {
    return type === CREDIT ? UNPAID : PAID;
}

const createSupply = async (req, res, next) => {
    try {
        const validation = SupplyValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const {
            supplier,
            type,
            items
        } = validation.value;
        const itemIds = items.map(item => item.itemId);
        const status = getSuppliestatus(type);
        const dbItems = await ItemService.getItemsByIds(itemIds);
        const itemMap = createItemMap(items);
        const _supplyItems = makeSupplyItems(type, dbItems, itemMap);
        const amount = getTotalAmount(_supplyItems);
        const _supply = {
            supplier, type, status, amount,
            createdBy: req.user.userId,
        }
        const supply = await Supplieservice.createSupply(_supply);
        const supplyItems = _supplyItems.map(supplyItem => ({
            supplyId: supply.supplyId,
            ...supplyItem
        }));
        await SupplyItemService.addAllSupplyItems(supplyItems);
        successRes(res, ADD_SUPPLY_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getSupplyByDate = async (req, res, next) => {
    try {
        const validation = SupplyValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _supplies = await Supplieservice.getSuppliesByDate(fromDate, toDate);
        const supplies = _supplies.map(_supply => {
            const { createdAt, supplyId, CreatedBy, supplier, type, amount } = _supply.get({ plain: true });
            return {
                createdAt,
                supplyId,
                createdBy: CreatedBy.name,
                supplier,
                type,
                amount
            }
        });
        const salesmanSupplies = supplies
            .filter(supply => supply.createdBy === req.user.userId)
            .map(({ amount, ...supply }) => supply);
        successRes(res, null, req.user.role === ADMIN ? supplies : salesmanSupplies);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    createSupply,
    getSupplyByDate,
})