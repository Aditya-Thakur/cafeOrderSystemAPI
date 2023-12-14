const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const axios = require('axios');
require('./db/db');
const { getAllItems, updateItem } = require('./controllers/item.controller');
const { getAllTables } = require('./controllers/table.controller');
const { getAllPaidOrders, getUnpaidOrders, addOrder,
    payOrder, updateOrder, removeOrder } = require('./controllers/order.controller');
const { dashboardPreview, orderByRank, getOrderByDate } = require('./controllers/dashboard.controller');
const { addExpense, getExpensesOfMonth, getExpensesOfDateRange } = require('./controllers/expense.controller');
const app = express();
const PORT = 4000;
app.use(cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const userWelcome = (req, res) => {
    res.send('Welcome to Cafe Order System Backend');
}

app.get('/', userWelcome);

app.get('/items', (req, res) => {
    getAllItems(req, res);
});

app.get('/tables', (req, res) => {
    getAllTables(req, res);
});

app.get('/allPaidOrders', (req, res) => {
    getAllPaidOrders(req, res);
});

app.get('/allUnpaidOrders', (req, res) => {
    getUnpaidOrders(req, res);
});

app.get('/dashboard', (req, res) => {
    dashboardPreview(req, res);
});

app.get('/orderByRank', (req, res) => {
    orderByRank(req, res);
});

app.post('/orderByRange', (req, res) => {
    getOrderByDate(req, res);
});

app.post('/newOrder', (req, res) => {
    addOrder(req, res);
});

app.put('/payOrder', (req, res) => {
    payOrder(req, res);
});

app.put('/updateOrder', (req, res) => {
    updateOrder(req, res);
});

app.delete('/removeOrder', (req, res) => {
    removeOrder(req, res);
});

app.post('/addExpense', (req, res) => {
    addExpense(req, res);
});

app.post('/getExpensesOfMonth', (req, res) => {
    getExpensesOfMonth(req, res);
});

app.post('/getExpensesOfDateRange', (req, res) => {
    getExpensesOfDateRange(req, res);
});

app.post('/updateItem', (req, res) => {
    updateItem(req, res);
});

app.listen(PORT, () => {
    console.log('Express is serving at port: ', PORT);
});

module.exports = app;