const mongoose = require('mongoose');
const order = mongoose.model('Order');
const paidOrder = mongoose.model('PaidOrder');
const Item = mongoose.model('Item');
const table = mongoose.model('Table');

// Define an aggregate function to get the sum of totalPrice
async function getTotalPriceSum() {
    try {
        const result = await paidOrder.aggregate([
            {
                $group: {
                    _id: null,  // Group all documents into a single group
                    totalPriceSum: { $sum: '$totalPrice' } // Calculate the sum of totalPrice field
                }
            }
        ]);

        // If there are results, the sum is in the first result
        if (result.length > 0) {
            return result[0].totalPriceSum;
        } else {
            return 0; // No documents found, return 0 as the sum
        }
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

// Define an aggregate function to get the sum of totalPrice for today's orders
async function getTotalPriceSumForToday() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const result = await paidOrder.aggregate([
            {
                $match: {
                    orderTime: { $gte: today } // Filter documents with orderTime greater than or equal to today
                }
            },
            {
                $group: {
                    _id: null,  // Group all matching documents into a single group
                    totalPriceSum: { $sum: '$totalPrice' } // Calculate the sum of totalPrice field
                }
            }
        ]);
        // If there are results, the sum is in the first result
        if (result.length > 0) {
            return result[0].totalPriceSum;
        } else {
            return 0; // No matching documents found for today, return 0 as the sum
        }
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

// Define a function to get the top 5 paidOrders for today and fill itemList with item details
async function getTop5PaidOrdersForTodayWithItems() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

        const top5PaidOrders = await paidOrder.find({
            orderTime: { $gte: today }
        })
        .limit(5)
        .exec();

        // Map the itemList with item details based on itemId
        const filledTop5PaidOrders = await Promise.all(
            top5PaidOrders.map(async (order) => {
                const newItemList = await Promise.all(
                    order.itemList.map(async (item) => {
                        const itemDetails = await Item.findOne({ id: item.itemId });
                        return {
                            ...item.toObject(),
                            itemDetails // Add item details to each item in itemList
                        };
                    })
                );
                return {
                    ...order.toObject(),
                    itemList: newItemList
                };
            })
        );

        return filledTop5PaidOrders;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}


// Define a function to get all paidOrders for today
async function getPaidOrdersForToday() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

        const paidOrders = await paidOrder.find({
            orderTime: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        return paidOrders;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

async function dashboardPreview(req, res) {
    const paidOrderCount = await paidOrder.countDocuments();
    const currentOrderCount = await order.countDocuments();
    const lifeTimeSale = await getTotalPriceSum();
    const todaysSale = await getTotalPriceSumForToday();
    const todaysOrders = await getTop5PaidOrdersForTodayWithItems();
    res.send({
        totalOrder: paidOrderCount,
        currentOrder: currentOrderCount,
        lifeTimeSale: lifeTimeSale,
        todaysSale: todaysSale,
        todaysOrders: todaysOrders
    });
}

async function getTopOrders(req, res) {
    const top5Orders = await getTop5MostOrderedItems();
    const top5OrdersByCategory = await getTop5OrderedItemsByCategory();
    res.send({
        top5Orders: top5Orders,
        top5OrdersByCategory: top5OrdersByCategory
    });
}

// Define a function to find the top 5 most ordered items
async function getTop5MostOrderedItems() {
    try {
        const result = await PaidOrder.aggregate([
            {
                $unwind: '$itemList' // Unwind the itemList array to create separate documents for each item
            },
            {
                $group: {
                    _id: '$itemList.itemId', // Group by itemId
                    totalOrdered: { $sum: '$itemList.quantity' } // Calculate the total quantity ordered for each item
                }
            },
            {
                $sort: { totalOrdered: -1 } // Sort by totalOrdered in descending order
            },
            {
                $limit: 5 // Limit the result to the top 5 items
            }
        ]);

        return result;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

async function getTop5OrderedItemsByCategory() {
    try {
        const result = await paidOrder.aggregate([
            {
                $unwind: '$itemList'
            },
            {
                $group: {
                    _id: '$itemList.itemId',
                    count: { $sum: '$itemList.quantity' }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);

        const topItems = await Promise.all(
            result.map(async (item) => {
                const itemDetails = await item.findOne({ id: item._id }, 'category subCategory itemName itemType price');
                return {
                    ...itemDetails.toObject(),
                    totalOrdered: item.count
                };
            })
        );

        // Group items by category
        const groupedItems = topItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        return groupedItems;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

// Define a function to get paidOrders within a date range
async function getPaidOrdersInDateRange(fromDate, toDate) {
    try {
        const paidOrders = await paidOrder.find({
            orderTime: {
                $gte: fromDate,
                $lte: toDate
            }
        }).exec();

        return paidOrders;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

async function getOrderByDate(req, res) {
    const ordersInGivenDate = await getPaidOrdersInDateRange(req.params.fromDate, req.params.toDate);
    res.send({
        ordersInGivenDate: ordersInGivenDate
    });
}

// Define a function to get all items sorted by order count
async function getAllItemsWithOrderCount() {
    try {
        const result = await Item.aggregate([
            {
                $lookup: {
                    from: 'PaidOrder', // Collection name for PaidOrder
                    localField: 'id',
                    foreignField: 'itemList.itemId',
                    as: 'orders'
                }
            },
            {
                $unwind: {
                    path: '$orders',
                    preserveNullAndEmptyArrays: true // Preserve items without orders
                }
            },
            {
                $group: {
                    _id: '$_id',
                    orderCount: {
                        $sum: {
                            $cond: [{ $gt: [{ $size: '$orders' }, 0] }, 1, 0]
                        }
                    }
                }
            },
            {
                $sort: { orderCount: -1 }
            }
        ],{ maxTimeMS: 60000 });

        const itemsWithOrderCount = await Promise.all(
            result.map(async (item) => {
                const itemDetails = await Item.findById(item._id);
                return {
                    ...itemDetails.toObject(),
                    orderCount: item.orderCount
                };
            })
        );

        return itemsWithOrderCount;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}


async function orderByRank(req, res) {
    const orderByRank = await getAllItemsWithOrderCount();
    res.send({
        orderByRank: orderByRank
    });
}

module.exports = { dashboardPreview, getTopOrders, orderByRank };