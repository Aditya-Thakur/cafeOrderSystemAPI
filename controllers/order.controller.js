const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const paidOrder = mongoose.model('PaidOrder');

// Function to get all paid orders
async function getAllPaidOrders(req, res) {
    let paidOrder = await paidOrder.find({});
    res.send(paidOrder);
}

// Function to get all unpaid orders
async function getUnpaidOrders(req, res) {
    let orders = await Order.find({});
    res.send(orders);
}

// Function to add new order
async function addOrder(req, res) {
    req.body.forEach(async order => {
        let newOrder = new Order();
        newOrder.orderId = order.orderId;
        newOrder.table = {
            id: order.table.id,
            name: order.table.name
        }
        newOrder.orderTime = order.orderTime;
        newOrder.itemList = [];
        order.itemList.forEach(orderItem => {
            newOrder.itemList.push({
                item : {
                    id: orderItem.item.id,
                    category: orderItem.item.category,
                    subCategory: orderItem.item.subCategory,
                    itemName: orderItem.item.itemName,
                    itemType: orderItem.item.itemType,
                    price: orderItem.item.price
                },
                quantity: orderItem.quantity
            });
        });
        await newOrder.save();
    });
    res.send({ message: 'Success', status: 200 });
}

// Function to update Order
async function updateOrder(req, res) {
    const filter = {
        orderId: req.body.orderId
    };
    const update = {
        itemList: req.body.itemList
    };
    let orderRes = await newOrder.findOneAndUpdate(filter, update);
    if (orderRes) {
        res.send({ message: 'Success', status: 200 });
    }
}

// Function to pay Order
async function payOrder(req, res) {
    console.log(req.body);
    let newOrder = new paidOrder();
    newOrder.orderId = req.body.orderId;
    newOrder.tableId = req.body.tableId;
    newOrder.customerName = req.body.customerName;
    newOrder.customerPhone = req.body.customerPhone;
    newOrder.orderTime = req.body.orderTime;
    newOrder.paymentMode = req.body.paymentMode;
    newOrder.totalPrice = req.body.totalPrice;
    newOrder.itemList = req.body.itemList
    let orderRes = await newOrder.save();
    if (orderRes) {
        await Order.deleteOne({ orderId: req.body.orderId });
        res.send({ message: 'Success', status: 200 });
    }
}

// Function to delete Order
async function removeOrder(req, res) {
    let orderRes = await Order.deleteOne({ orderId: req.params.orderId });
    if (orderRes) {
        res.send({ message: 'Success', status: 200 });
    }
}

module.exports = { getAllPaidOrders, getUnpaidOrders, addOrder, payOrder, updateOrder, removeOrder };