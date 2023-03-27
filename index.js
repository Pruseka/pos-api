const express = require('express');
const cors = require('cors');

const authHandler = require('./src/middlewares/Auth.middleware.js');
const errorHandler = require('./src/middlewares/Error.middleware');

const db = require('./src/db/connection.js');

const loginRoute = require('./src/routes/Login.route');
const addAdminRoute = require('./src/routes/AddAdmin.route');

const categoryRoute = require('./src/routes/Category.route');
const customerRoute = require('./src/routes/Customer.route');
const supplierRoute = require('./src/routes/Supplier.route.js');

const expenseRoute = require('./src/routes/Expense.route.js');

const itemRoute = require('./src/routes/Item.route.js');
const invoiceRoute = require('./src/routes/Invoice.route');
const supplyRoute = require('./src/routes/Supply.route.js');
const summaryRoute = require('./src/routes/Summary.route');
const transferRoute = require('./src/routes/Transfer.route');
const customerTransferRoute = require('./src/routes/CustomerTransfer.route');
const customerStockRoute = require('./src/routes/CustomerStock.route.js');
const warehouseRoute = require('./src/routes/Warehouse.route');
const vanStockRoute = require('./src/routes/VanStock.route');
const userRoute = require('./src/routes/User.route');

const {
    ADMIN,
    SALES_ADMIN,
    VAN_SALES,
} = require('./src/configs/constant.config.js');

const app = express();

//default middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/add/admin', addAdminRoute);
app.use('/api/login', loginRoute);

app.use('/api/category', authHandler([ADMIN, SALES_ADMIN, VAN_SALES]), categoryRoute);
app.use('/api/customer', authHandler([ADMIN, SALES_ADMIN, VAN_SALES]), customerRoute);
app.use('/api/customer_stock', authHandler([ADMIN, SALES_ADMIN]), customerStockRoute);
app.use('/api/customer_transfer', authHandler([ADMIN, SALES_ADMIN]), customerTransferRoute);
app.use('/api/expense', authHandler([ADMIN]), expenseRoute);
app.use('/api/invoice', authHandler([ADMIN, SALES_ADMIN, VAN_SALES]), invoiceRoute);
app.use('/api/supplier', authHandler([ADMIN, SALES_ADMIN]), supplierRoute);
app.use('/api/summary', authHandler([ADMIN]), summaryRoute);
app.use('/api/transfer', authHandler([ADMIN, SALES_ADMIN]), transferRoute);
app.use('/api/van_stock', authHandler([ADMIN, SALES_ADMIN, VAN_SALES]), vanStockRoute);
app.use('/api/warehouse', authHandler([ADMIN, SALES_ADMIN]), warehouseRoute);

app.use('/api/item', itemRoute);
app.use('/api/supply', supplyRoute);
app.use('/api/user', userRoute);


app.use(errorHandler);

//check for db
db.authenticate().then(() => {
    console.log('⚡ Connected to the database');
})

//open up server
app.listen(5000, () => console.log('⚡ server is running at: 5000'));

