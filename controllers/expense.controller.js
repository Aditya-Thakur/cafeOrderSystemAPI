const mongoose = require('mongoose');

const Expense = mongoose.model('Expense');

// Function to get all items
async function addExpense(req, res) {
    let newExpense = new Expense();
    newExpense.expenseId = req.body.expenseId;
    newExpense.expenseKey = req.body.expenseKey;
    newExpense.date = req.body.date;
    newExpense.amount = req.body.amount;
    await newExpense.save();
    res.send({ message: 'Success', status: 200 });
}

// Method to get expenses for a given month
async function getExpensesOfMonth(req, res) {
    try {
        const year = parseInt(req.body.year);
        const month = parseInt(req.body.month) - 1; // JavaScript months are 0-based (0 is January)

        // Calculate the start and end dates for the given month
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // End of the last day of the month

        // Query expenses within the specified month
        const expenses = await Expense.find({
            date: { $gte: startDate, $lte: endDate },
        }).exec();

        res.json(expenses);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching expenses.' });
    }
}

module.exports = { addExpense, getExpensesOfMonth };