const mongoose = require('mongoose');
const username = encodeURIComponent("cafeAdmin");
const password = encodeURIComponent("IRROze3DamxJs7Ua");

let uri = `mongodb+srv://${username}:${password}@darbhanga.rfy7wy6.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri,  { useUnifiedTopology: true }).then(
    () => { console.log('connected to db'); }
).catch(
    (err) => { console.log('err connecting to db: ', err); }
);

require('./../models/item.model');
require('./../models/table.model');
require('./../models/order.model');
require('./../models/paidOrder.model');