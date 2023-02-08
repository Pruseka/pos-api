const SupplierService = require("../services/Supplier.service.js");

const SupplierValidator = require("../validators/Supplier.validator.js");

const {
    ADD_SUPPLIER_SUCCESS,
    UPDATE_SUPPLIER_SUCCESS,
} = require("../configs/message.config.js");

const {
    successRes
} = require("../utils/response.utils.js");

const addSupplier = async (req, res, next) => {
    try {
        const validation = SupplierValidator.addValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        await SupplierService.createSupplier(validation.value);
        successRes(res, ADD_SUPPLIER_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const updateSupplier = async (req, res, next) => {
    try {
        const validation = SupplierValidator.updateValidator.validate(req.body);
        if (validation.error) {
            throw validation.error;
        }
        const { supplierId, ...supplier } = validation.value;
        await SupplierService.updateSupplier(supplierId, supplier);
        successRes(res, UPDATE_SUPPLIER_SUCCESS);
    } catch (err) {
        next(err);
    }
}

const getAllSuppliers = async (_, res, next) => {
    try {
        const suppliers = await SupplierService.getAllSuppliers();
        successRes(res, null, suppliers);
    } catch (err) {
        next(err);
    }
}


module.exports = Object.freeze({
    addSupplier,
    updateSupplier,
    getAllSuppliers
})