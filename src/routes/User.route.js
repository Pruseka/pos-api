const { Router } = require("express");

const {
    addUser,
    updateUser,
    getAllUsers,
} = require("../controllers/User.controller");

const userRoute = Router();

userRoute.get('/all', getAllUsers);
userRoute.post('/', addUser);
userRoute.put('/', updateUser);

module.exports = userRoute;