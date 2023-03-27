const { Router } = require("express");
const { ADMIN, SALES_ADMIN } = require("../configs/constant.config");

const {
    addUser,
    updateUser,
    updatePassword,
    getAllUsers,
    getAllSalesAdmins,
    getAllVanSales,
} = require("../controllers/User.controller");

const authHandler = require('../middlewares/Auth.middleware');

const userRoute = Router();

userRoute.get('/all', authHandler([ADMIN]), getAllUsers);
userRoute.get('/sales_admin',authHandler([ADMIN]), getAllSalesAdmins);
userRoute.get('/van_sales',authHandler([ADMIN, SALES_ADMIN]), getAllVanSales);
userRoute.post('/',authHandler([ADMIN]), addUser);
userRoute.put('/',authHandler([ADMIN]), updateUser);
userRoute.put('/password',authHandler([ADMIN]), updatePassword);

module.exports = userRoute;