const Supplier = require("../models/Supplier.model.js");

const createSupplier = async (supplier) => {
    await Supplier.create(supplier);
}

const getAllSuppliers = async () => {
    return await Supplier.findAll();
}

const getSupplierById = async (supplierId) => {
    return await Supplier.findByPk(supplierId);
}

const updateSupplier = async (supplierId, supplier) => {
    await Supplier.update(supplier, {
        where: { supplierId }
    })
}

module.exports = Object.freeze({
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
})