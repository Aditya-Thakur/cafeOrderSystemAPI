const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    orderId: {
        type: Number
    },
    table: {
        type: {
            id: Number,
            name: String
        }
    },
    customerName: {
        type: String
    },
    customerPhone: {
        type: String
    },
    itemList: {
        type: [
            {
                item: {
                    type: {
                        itemId: {
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
                    }
                },
                quantity: {
                    type: Number
                }
            }
        ]
    },
    orderTime: {
        type: Date
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


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;