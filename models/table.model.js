const mongoose = require('mongoose');

let tableSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    }
})

mongoose.model('Table', tableSchema)