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
    itemList: {
        type: [
            {
                item: {
                    type: {
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
    }
})

mongoose.model('Order', orderSchema)