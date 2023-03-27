const SupplyService = require("../services/Supply.service.js");
const ItemService = require("../services/Item.service.js");
const SupplyItemService = require("../services/SupplyItem.service.js");

const SupplyValidator = require("../validators/Supply.validator.js");

const {
    successRes
} = require("../utils/response.utils.js");

const {
    createError
} = require("../utils/error.utils");

const {
    ADD_SUPPLY_SUCCESS,
    PAID_SUPPLY_SUCCESS,
    SUPPLY_NOT_EXIST,
} = require("../configs/message.config.js");

const {
    CREDIT,
    UNPAID,
    PAID,
    ADMIN,
    BadRequestError
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
        const supply = await SupplyService.createSupply(_supply);
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
        const _supplies = await SupplyService.getSuppliesByDate(fromDate, toDate);
        const adminSupplies = _supplies.map(_supply => {
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
        const supplies = adminSupplies
            .map(({ amount, ...supply }) => supply);
        successRes(res, null, req.user.role === ADMIN ? adminSupplies : supplies);
    } catch (err) {
        next(err);
    }
}

const getCreditSuppliesByDate = async (req, res, next) => {
    try {
        const validation = SupplyValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _creditSupplies = await SupplyService.getCreditSuppliesByDate(fromDate, toDate);
        const creditSupplies = _creditSupplies.map(_supply => {
            const { supplyId, supplier, status, amount, CreatedBy, createdAt, WithdrawnBy, withdrawnAt } = _supply.get({ plain: true });
            return {
                supplyId,
                supplier,
                status,
                amount,
                createdBy: CreatedBy.name,
                createdAt,
                withdrawnBy: WithdrawnBy ? WithdrawnBy.name : null,
                withdrawnAt,
            }
        });
        successRes(res, null, creditSupplies);
    } catch (err) {
        next(err);
    }
}

const updateSupplyStatus = async (req, res, next) => {
    try {
        const validation = SupplyValidator.updateValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { supplyId } = validation.value;
        await SupplyService.updateSupply(supplyId, {
            status: PAID,
            withdrawnBy: req.user.userId,
            withdrawnAt: new Date()
        });
        successRes(res, null, PAID_SUPPLY_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getSupplyById = async (req, res, next) => {
    try {
        const validation = SupplyValidator.getValidator.validate(req.params);
        if (validation.error) {
            throw validation.error;
        };
        const { supplyId } = validation.value;
        const _supply = await SupplyService.getSupplyById(supplyId);
        if (!_supply) createError(BadRequestError, SUPPLY_NOT_EXIST);
        const { supplier, type, amount, CreatedBy, SupplyItems } = _supply.get({ plain: true });
        const adminItems = SupplyItems.map(item => {
            const { itemId, qty, price, amount, Item } = item;
            return {
                itemId,
                code: Item.code,
                name: Item.name,
                category: Item.Category.name,
                qty,
                price,
                amount,
            }
        });
        const items = adminItems.map(({ amount, ...item }) => item);
        const adminSupply = {
            supplier,
            type,
            amount,
            createdBy: CreatedBy.name,
            items: adminItems,
        }
        const supply = {
            supplier,
            type,
            createdBy: CreatedBy.name,
            items,
        }
        successRes(res, null, req.user.role === ADMIN ? adminSupply : supply);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    createSupply,
    getSupplyById,
    getSupplyByDate,
    getCreditSuppliesByDate,
    updateSupplyStatus
})