const { Router } = require("express");

const {
    addAdmin
} = require("../controllers/User.controller");

const addAdminRoute = Router();

addAdminRoute.post('/', addAdmin);

module.exports = addAdminRoute;