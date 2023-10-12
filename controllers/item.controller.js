const mongoose = require('mongoose');

const Item = mongoose.model('Item');

// Function to get all items
async function getAllItems(req, res) {
    let items = await Item.find({});
    res.send(items);
}

async function updateItem(req, res) {
    const filter = {
        itemId: req.body.itemId
    };
    const update = {
        itemName: req.body.itemName,
        itemType: req.body.itemType,
        price: req.body.price
    };
    let itemRes = await Item.findOneAndUpdate(filter, update);
    if (itemRes) {
        res.send({ message: 'Success', status: 200 });
    }
}

module.exports = { getAllItems, updateItem };