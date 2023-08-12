const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const axios = require('axios');

const app = express();
const PORT = 8000;
// app.use(cors());
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
// app.use(bodyParser.json())

let count = 0;

const userCount = (req, res) => {
    res.json({
        hi: "Hi there your user count is " + ++count
    });
}

app.get('/welcome', userCount);

app.get('/bye',
(req, res) => {
    res.send('ok bye');
}
) 

app.listen(PORT, () => {
    console.log('Express is serving at port: ', PORT);
});