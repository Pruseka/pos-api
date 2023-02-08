const User = require("../models/User.model.js");

const createUser = async (user) => {
    await User.create(user);
}

const getAllUsers = async () => {
    return await User.findAll();
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
    getUserById,
    getUserByEmail,
    updateUser,
})