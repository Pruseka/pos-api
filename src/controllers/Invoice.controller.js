const InvoiceService = require("../services/Invoice.service.js");
const ItemService = require("../services/Item.service.js");
const InvoiceItemService = require("../services/InvoiceItem.service.js");

const InvoiceValidator = require("../validators/Invoice.validator.js");

const {
    successRes
} = require("../utils/response.utils.js");

const {
    createError
} = require("../utils/error.utils");

const {
    ADD_INVOICE_SUCCESS,
    INVOICE_NOT_EXIST,
    PAID_INVOICE_SUCCESS,
} = require("../configs/message.config.js");


const {
    WHOLESALES,
    CREDIT,
    UNPAID,
    PAID,
    BadRequestError,
    VAN_SALES,
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

const makeInvoiceItems = (customerType, type, dbItems, itemMap) => {

    const getPrice = (item, customerType) => {
        return (customerType === WHOLESALES) ? item.wholesalesPrice : item.retailPrice;
    }

    return dbItems.map(item => {
        const qty = itemMap.get(item.itemId) ?? 0;
        const price = getPrice(item, customerType);
        const amount = qty * price;
        return {
            itemId: item.itemId,
            type, qty, price, amount,
        }
    })
}

const getTotalAmount = (invoiceItems) => {
    let totalAmount = 0;
    invoiceItems.forEach(item => {
        totalAmount += item.amount;
    });
    return totalAmount;
}

const getInvoiceStatus = (type) => {
    return type === CREDIT ? UNPAID : PAID;
}

const createInvoice = async (req, res, next) => {
    try {
        const validation = InvoiceValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const {
            customer,
            customerType,
            type,
            items
        } = validation.value;
        const itemIds = items.map(item => item.itemId);
        const status = getInvoiceStatus(type);
        const dbItems = await ItemService.getItemsByIds(itemIds);
        const itemMap = createItemMap(items);
        const _invoiceItems = makeInvoiceItems(customerType, type, dbItems, itemMap);
        const amount = getTotalAmount(_invoiceItems);
        const _invoice = {
            customer, customerType, type, status, amount,
            createdBy: req.user.userId,
            receivedBy: status === PAID ? req.user.userId : null,
            receivedAt: status === PAID ? new Date() : null,
        }
        const invoice = await InvoiceService.createInvoice(_invoice);
        const invoiceItems = _invoiceItems.map(invoiceItem => ({
            invoiceId: invoice.invoiceId,
            ...invoiceItem
        }));
        await InvoiceItemService.addAllInvoiceItems(invoiceItems);
        successRes(res, ADD_INVOICE_SUCCESS, {
            invoiceId: invoice.invoiceId
        });
    } catch (err) {
        next(err);
    }
}

const getInvoiceByDate = async (req, res, next) => {
    try {
        const validation = InvoiceValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _invoices = await InvoiceService.getInvoicesByDate(fromDate, toDate);
        const invoices = _invoices.map(_invoice => {
            const { createdAt, CreatedBy, invoiceId, customer, customerType, type, amount } = _invoice.get({ plain: true });

            return {
                createdAt,
                invoiceId,
                createdBy: CreatedBy.name,
                userId: CreatedBy.userId,
                customer,
                customerType,
                type,
                amount,
            }
        });
        const vansalesInvoices = invoices.filter(invoice => invoice.userId === req.user.userId);
        successRes(res, null, req.user.role === VAN_SALES ? vansalesInvoices : invoices);
    } catch (err) {
        next(err);
    }
}

const getCreditInvoicesByDate = async (req, res, next) => {
    try {
        const validation = InvoiceValidator.getByDateValidator.validate(req.query);
        if (validation.error) {
            throw validation.error;
        }
        const { from, to } = validation.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const _creditInvoices = await InvoiceService.getCreditInvoicesByDate(fromDate, toDate);
        const creditInvoices = _creditInvoices.map(_invoice => {
            const { customerType, type, createdBy, CreatedBy, receivedBy, ReceivedBy, ...invoice } = _invoice.get({ plain: true });
            return {
                ...invoice,
                createdBy: CreatedBy.name,
                receivedBy: ReceivedBy ? ReceivedBy.name : null,
            }
        })
        const vansalesInvoices = creditInvoices.filter(invoice => invoice.createdBy === req.user.userId);
        successRes(res, null, req.user.role === VAN_SALES ? vansalesInvoices : creditInvoices);
        // successRes(res, null, creditInvoices);
    } catch (err) {
        next(err);
    }
}

const updateInvoiceStatus = async (req, res, next) => {
    try {
        const validation = InvoiceValidator.updateValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { invoiceId } = validation.value;
        await InvoiceService.updateInvoice(invoiceId, {
            status: PAID,
            receivedBy: req.user.userId,
            receivedAt: new Date()
        });
        successRes(res, PAID_INVOICE_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getInvoiceById = async (req, res, next) => {
    try {
        const validation = InvoiceValidator.getValidator.validate(req.params);
        if (validation.error) {
            throw validation.error;
        };
        const { invoiceId } = validation.value;
        const invoice = await InvoiceService.getInvoiceById(invoiceId);
        if (!invoice) createError(BadRequestError, INVOICE_NOT_EXIST);
        const { customer, customerType, type, amount, CreatedBy, InvoiceItems } = invoice.get({ plain: true });
        const items = InvoiceItems.map(item => {
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
        })
        successRes(res, null, {
            customer,
            customerType,
            type,
            amount,
            createdBy: CreatedBy.name,
            items
        });
    } catch (err) {
        next(err);
    }
}

module.exports = Object.freeze({
    createInvoice,
    updateInvoiceStatus,
    getInvoiceById,
    getInvoiceByDate,
    getCreditInvoicesByDate,
})