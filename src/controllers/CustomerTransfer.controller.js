const CustomerTransferService = require("../services/CustomerTransfer.service.js");
const CustomerService = require('../services/Customer.service');
const ItemService = require("../services/Item.service.js");
const CustomerTransferItemService = require("../services/CustomerTransferItem.service.js");

const CustomerTransferValidator = require("../validators/CustomerTransfer.validator.js");

const {
    successRes
} = require("../utils/response.utils.js");

const {
    ADD_CUSTOMER_TRANSFER_SUCCESS,
    CUSTOMER_NOT_EXIST,
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

const makeCustomerTransferItems = (customerId, type, dbItems, itemMap) => {

    return dbItems.map(item => {
        const qty = itemMap.get(item.itemId) ?? 0;
        return {
            itemId: item.itemId,
            customerId, type, qty,
        }
    })
}

const createCustomerTransfer = async (req, res, next) => {
    try {
        const validation = CustomerTransferValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const {
            customerId,
            type,
            items
        } = validation.value;
        const customer = await CustomerService.getCustomerById(customerId);
        if (!customer) {
            throw createError(BadRequestError, CUSTOMER_NOT_EXIST);
        }
        const itemIds = items.map(item => item.itemId);
        const dbItems = await ItemService.getItemsByIds(itemIds);
        const itemMap = createItemMap(items);
        const _customertransferItems = makeCustomerTransferItems(customerId, type, dbItems, itemMap);
        const _customertransfer = {
            customerId, type,
            createdBy: req.user.userId,
        }
        const customertransfer = await CustomerTransferService.createCustomerTransfer(_customertransfer);
        const customertransferItems = _customertransferItems.map(customertransferItem => ({
            customerTransferId: customertransfer.customerTransferId,
            ...customertransferItem
        }));
        await CustomerTransferItemService.addAllCustomerTransferItems(customertransferItems);
        successRes(res, ADD_CUSTOMER_TRANSFER_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getCustomerTransferByDate = async (req, res, next) => {
    try {
        const validation = CustomerTransferValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _customertransfers = await CustomerTransferService.getCustomerTransfersByDate(fromDate, toDate);
        const customertransfers = _customertransfers.map(_customertransfer => {
            const { CustomerTransferItems, Customer, CreatedBy, ...customertransfer } = _customertransfer.get({ plain: true });
            const items = CustomerTransferItems.map(customertransferItem => {
                return {
                    itemId: customertransferItem.itemId,
                    code: customertransferItem.Item.code,
                    name: customertransferItem.Item.name,
                    category: customertransfer.Item.Category.name,
                    qty: customertransferItem.qty,
                }
            });
            return {
                items,
                customer: Customer.name,
                createdByName: CreatedBy.name,
                ...customertransfer
            }
        });
        successRes(res, null, customertransfers);
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    createCustomerTransfer,
    getCustomerTransferByDate,
})