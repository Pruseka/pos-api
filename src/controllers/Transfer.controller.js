const TransferService = require("../services/Transfer.service.js");
const UserService = require('../services/User.service');
const ItemService = require("../services/Item.service.js");
const TransferItemService = require("../services/TransferItem.service.js");

const TransferValidator = require("../validators/Transfer.validator.js");

const {
    successRes
} = require("../utils/response.utils.js");

const {
    ADD_TRANSFER_SUCCESS,
    USER_NOT_EXIST
} = require("../configs/message.config.js");

const {
    createError
} = require('../utils/error.utils');

const {
    ADMIN,
    BadRequestError,
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

const makeTransferItems = (userId, type, dbItems, itemMap) => {

    return dbItems.map(item => {
        const qty = itemMap.get(item.itemId) ?? 0;
        return {
            itemId: item.itemId,
            userId, type, qty,
        }
    })
}

const createTransfer = async (req, res, next) => {
    try {
        const validation = TransferValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const {
            userId,
            type,
            items
        } = validation.value;
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw createError(BadRequestError, USER_NOT_EXIST);
        }
        const itemIds = items.map(item => item.itemId);
        const dbItems = await ItemService.getItemsByIds(itemIds);
        const itemMap = createItemMap(items);
        const _transferItems = makeTransferItems(userId, type, dbItems, itemMap);
        const _transfer = {
            userId, type,
            createdBy: req.user.userId,
        }
        const transfer = await TransferService.createTransfer(_transfer);
        const transferItems = _transferItems.map(transferItem => ({
            transferId: transfer.transferId,
            ...transferItem
        }));
        await TransferItemService.addAllTransferItems(transferItems);
        successRes(res, ADD_TRANSFER_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getTransferByDate = async (req, res, next) => {
    try {
        const validation = TransferValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _transfers = await TransferService.getTransfersByDate(fromDate, toDate);
        const transfers = _transfers.map(_transfer => {
            const { TransferItems, User, CreatedBy, ...transfer } = _transfer.get({ plain: true });
            const items = TransferItems.map(transferItem => {
                return {
                    itemId: transferItem.itemId,
                    name: transferItem.Item.name,
                    qty: transferItem.qty,
                }
            });
            return {
                items,
                user: User.name,
                createdByName: CreatedBy.name,
                ...transfer
            }
        });
        const salesmanTransfers = transfers.filter(transfer => transfer.userId === req.user.userId);
        successRes(res, null, req.user.role === ADMIN ? transfers : salesmanTransfers);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    createTransfer,
    getTransferByDate,
})