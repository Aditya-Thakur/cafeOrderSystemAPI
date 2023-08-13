const mongoose = require('mongoose');

const table = mongoose.model('Table');

// Function to get all items
async function getAllTables(req, res) {
    let tables = await table.find({});
    res.send(tables)
}

module.exports = { getAllTables };