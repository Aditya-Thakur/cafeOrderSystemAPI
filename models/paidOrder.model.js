const mongoose = require('mongoose');

let paidOrderSchema = new mongoose.Schema({
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
    customerPhone: {
        type: String
    },
    paymentMode: {
        type: String
    },
    orderTime: {
        type: Date
    },
    totalPrice: {
        type: Number
    },
    dailyOrderId: {
        type: Number
    },
    continuousOrderId: {
        type: Number
    },
    discount: {
        type: Number
    }
});

mongoose.model('PaidOrder', paidOrderSchema)