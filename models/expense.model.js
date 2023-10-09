const mongoose = require('mongoose');

let expenseSchema = new mongoose.Schema({
    expenseId: {
        type: Number
    },
    expenseKey: {
        type: String
    },
    date: {
        type: Date
    },
    amount: {
        type: Number
    }
})

mongoose.model('Expense', expenseSchema)