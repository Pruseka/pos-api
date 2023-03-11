const { Router } = require("express");

const {
    addUser,
    updateUser,
    updatePassword,
    getAllUsers,
} = require("../controllers/User.controller");

const userRoute = Router();

userRoute.get('/all', getAllUsers);
userRoute.post('/', addUser);
userRoute.put('/', updateUser);
userRoute.put('/password', updatePassword);

module.exports = userRoute;