const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    dailyOrderCount: {
        type: Number,
        default: 1, // Initialize dailyOrderCount with 1 for the first order of the day
    },
    totalOrderCount: {
        type: Number,
        default: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

const Counter = mongoose.model('Counter', counterSchema);

Counter.updateCounts = async function () {
    try {
        const currentDate = new Date();
        const currentDay = currentDate.toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

        // Find the document, and if it doesn't exist, create it with default values
        const counterDoc = await this.findOneAndUpdate({}, {}, { upsert: true, new: true });

        // Check if the saved date is the same as the current date
        const savedDay = counterDoc.lastUpdated && counterDoc.lastUpdated.toISOString().split('T')[0];
        if (savedDay === currentDay) {
            // If it's the same day, increment dailyOrderCount
            counterDoc.dailyOrderCount += 1;
        } else {
            // If it's a new day, reset dailyOrderCount to 1
            counterDoc.dailyOrderCount = 1;
        }

        // Increment totalOrderCount
        counterDoc.totalOrderCount += 1;

        // Update the lastUpdated field
        counterDoc.lastUpdated = currentDate;

        // Save the updated document
        await counterDoc.save();

        // Return the latest counter values
        return {
            dailyOrderCount: counterDoc.dailyOrderCount,
            totalOrderCount: counterDoc.totalOrderCount,
        };
    } catch (error) {
        throw error;
    }
};

module.exports = Counter;
