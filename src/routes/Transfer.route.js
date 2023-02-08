const TransferController = require("../controllers/Transfer.controller.js");
const { Router } = require("express");

const transferRoute = Router();

transferRoute.post('/', TransferController.createTransfer);
transferRoute.get('/', TransferController.getTransferByDate);

module.exports = transferRoute;