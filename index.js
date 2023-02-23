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
const transferRoute = require('./src/routes/Transfer.route');
const customerTransferRoute = require('./src/routes/CustomerTransfer.route');
const warehouseRoute = require('./src/routes/Warehouse.route');
const stockRoute = require('./src/routes/Stock.route');

const {
    ADMIN,
    SALESMAN,
} = require('./src/configs/constant.config.js');

const app = express();

//default middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/add/admin', addAdminRoute);
app.use('/api/login', loginRoute);

app.use('/api/category', authHandler([ADMIN, SALESMAN]), categoryRoute);
app.use('/api/customer', authHandler([ADMIN, SALESMAN]), customerRoute);
app.use('/api/supplier', authHandler([ADMIN, SALESMAN]), supplierRoute);
app.use('/api/invoice', authHandler([ADMIN, SALESMAN]), invoiceRoute);
app.use('/api/supply', authHandler([ADMIN, SALESMAN]), supplyRoute);
app.use('/api/transfer', authHandler([ADMIN, SALESMAN]), transferRoute);
app.use('/api/customer_transfer', authHandler([ADMIN, SALESMAN]), customerTransferRoute);
app.use('/api/warehouse', authHandler([ADMIN, SALESMAN]), warehouseRoute);
app.use('/api/stock', authHandler([ADMIN, SALESMAN]), stockRoute);

app.use('/api/expense', authHandler([ADMIN]), expenseRoute);

app.use('/api/item', itemRoute);


app.use(errorHandler);

//check for db
db.authenticate().then(() => {
    console.log('⚡ Connected to the database');
})

//open up server
app.listen(5000, () => console.log('⚡ server is running at: 5000'));

