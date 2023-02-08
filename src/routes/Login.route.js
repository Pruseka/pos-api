const { Router } = require("express");

const {
    userLogin
} = require("../controllers/Login.controller");

const loginRoute = Router();

loginRoute.post('/', userLogin);

module.exports = loginRoute;