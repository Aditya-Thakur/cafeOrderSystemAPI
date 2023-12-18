const mongoose = require('mongoose');
const username = encodeURIComponent("cafeAdmin");
const password = encodeURIComponent("IRROze3DamxJs7Ua");

let uri = `mongodb+srv://${username}:${password}@darbhanga.rfy7wy6.mongodb.net/?retryWrites=true&w=majority`;
// let uri = `mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.0`;
mongoose.connect(uri, { useUnifiedTopology: true }).then(
    () => { console.log('connected to db'); }
).catch(
    (err) => { console.log('err connecting to db: ', err); }
);

require('./../models/item.model');
require('./../models/table.model');
require('./../models/order.model');
require('./../models/paidOrder.model');
require('./../models/expense.model');
require('./../models/counter.model');