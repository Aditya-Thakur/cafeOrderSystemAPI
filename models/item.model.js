const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    category: {
        type: String
    },
    subCategory: {
        type: String
    },
    itemName: {
        type: String
    },
    itemType: {
        type: String
    },
    price: {
        type: Number
    }
})

mongoose.model('Item', itemSchema)