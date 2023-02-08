const SummaryController = require("../controllers/Summary.controller.js");
const { Router } = require("express");

const summaryRoute = Router();

summaryRoute.get('/', SummaryController.getSummaryByDate);

module.exports = summaryRoute;