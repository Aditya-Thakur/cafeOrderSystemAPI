const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    orderId: {
        type: Number
    },
    tableId: {
        type: Number
    },
    itemList: {
        type: [{
            itemId: {
                type: Number
            },
            quantity: {
                type: Number
            }
        }]
    },
    customerName: {
        type: String
    },
    CustomerPhone: {
        type: String
    }
    })

mongoose.model('Order', orderSchema)