const mongoose = require('mongoose');

const item = mongoose.model('Item');

// Function to get all items
async function getAllItems(req, res) {
    let items = await item.find({});
    res.send(items);
}

module.exports = { getAllItems };