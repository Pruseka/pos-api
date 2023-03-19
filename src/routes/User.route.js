const { Router } = require("express");

const {
    addUser,
    updateUser,
    updatePassword,
    getAllUsers,
    getAllSalesAdmins,
    getAllVanSales,
} = require("../controllers/User.controller");

const userRoute = Router();

userRoute.get('/all', getAllUsers);
userRoute.get('/sales_admin', getAllSalesAdmins);
userRoute.get('/van_sales', getAllVanSales);
userRoute.post('/', addUser);
userRoute.put('/', updateUser);
userRoute.put('/password', updatePassword);

module.exports = userRoute;