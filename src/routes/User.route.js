const { Router } = require("express");

const {
    addUser,
    updateUser,
    updatePassword,
    getAllUsers,
    getAllSalesManagers,
    getAllVanSales,
} = require("../controllers/User.controller");

const userRoute = Router();

userRoute.get('/all', getAllUsers);
userRoute.get('/sales_managers', getAllSalesManagers);
userRoute.get('/van_sales', getAllVanSales);
userRoute.post('/', addUser);
userRoute.put('/', updateUser);
userRoute.put('/password', updatePassword);

module.exports = userRoute;