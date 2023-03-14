const User = require("../models/User.model.js");

const {
    SALES_MANAGER,
    VAN_SALES,
} = require("../configs/constant.config");

const createUser = async (user) => {
    await User.create(user);
}

const getAllUsers = async () => {
    return await User.findAll();
}

const getAllVanSales = async () => {
    return await User.findAll({
        where: {
            role: VAN_SALES
        }
    })
}

const getAllSalesManagers = async() => {
    return await User.findAll({
        where: {
            role: SALES_MANAGER,
        }
    })
}

const getUserById = async (userId) => {
    return await User.findByPk(userId);
}

const getUserByEmail = async (email) => {
    return await User.findOne({
        where: { email }
    })
}

const updateUser = async (userId, user) => {
    await User.update(user, {
        where: { userId }
    })
}

module.exports = Object.freeze({
    createUser,
    getAllUsers,
    getAllSalesManagers,
    getAllVanSales,
    getUserById,
    getUserByEmail,
    updateUser,
})