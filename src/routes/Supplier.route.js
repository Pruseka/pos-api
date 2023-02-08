const { Router } = require("express");

const {
    addSupplier,
    updateSupplier,
    getAllSuppliers,
} = require("../controllers/Supplier.controller");

const supplierRoute = Router();

supplierRoute.get('/all', getAllSuppliers);
supplierRoute.post('/', addSupplier);
supplierRoute.put('/', updateSupplier);

module.exports = supplierRoute;