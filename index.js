const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const axios = require('axios');
require('./db/db');
const { getAllItems } = require('./controllers/item.controller');
const { getAllTables } = require('./controllers/table.controller');
const app = express();
const PORT = 8000;
app.use(  cors({
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

app.get('/welcome', userWelcome);

app.get('/items', (req,res) => {
    getAllItems(req, res);
});

app.get('/tables', (req,res) => {
    getAllTables(req, res);
})

app.listen(PORT, () => {
    console.log('Express is serving at port: ', PORT);
});