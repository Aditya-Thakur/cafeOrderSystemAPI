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

orderSchema.pre('save', async function (next) {
    // If it's a new order, generate and set the daily order ID
    if (this.isNew) {
        this.dailyOrderId = await this.generateDailyOrderId();
    }

    // Always update the continuous order ID
    this.continuousOrderId = await this.generateContinuousOrderId();

    next();
});

// Define methods to generate daily and continuous order IDs
orderSchema.methods.generateDailyOrderId = async function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    // Find the highest daily order ID for the current day and increment it
    const highestDailyOrder = await Order.findOne(
        { createdAt: { $gte: today } },
        { dailyOrderId: 1 },
    )
        .sort({ dailyOrderId: -1 })
        .limit(1);

    return highestDailyOrder
        ? highestDailyOrder.dailyOrderId + 1
        : 1; // If no orders for the day, start from 1
};

orderSchema.methods.generateContinuousOrderId = async function () {
    // Find the highest continuous order ID and increment it
    const highestContinuousOrder = await Order.findOne({}, { continuousOrderId: 1 })
        .sort({ continuousOrderId: -1 })
        .limit(1);

    return highestContinuousOrder
        ? highestContinuousOrder.continuousOrderId + 1
        : 1; // If no orders, start from 1
};


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;