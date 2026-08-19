import asyncHandler from 'express-async-handler';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';

// @desc    Get predictive insights and recommendations
// @route   GET /api/insights
// @access  Private
export const getInsights = asyncHandler(async (req, res) => {
    const insights = [];

    // --- 1. BUDGET FORECASTING ENGINE ---
    // Mathematically predict if the user will overrun their limit based on their current velocity
    const activeBudgets = await Budget.find({ 
        user: req.user._id,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
    }).populate('category', 'name');

    for (let budget of activeBudgets) {
        const summary = await Transaction.aggregate([
            {
                $match: { 
                    user: req.user._id,
                    type: 'expense',
                    category: budget.category._id,
                    date: { $gte: budget.startDate, $lte: budget.endDate }
                }
            },
            { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
        ]);

        const spentAmount = summary.length > 0 ? summary[0].totalSpent : 0;
        
        const totalDurationMs = new Date(budget.endDate).getTime() - new Date(budget.startDate).getTime();
        const elapsedMs = Date.now() - new Date(budget.startDate).getTime();
        
        const totalDays = Math.ceil(totalDurationMs / (1000 * 60 * 60 * 24));
        const elapsedDays = Math.max(Math.ceil(elapsedMs / (1000 * 60 * 60 * 24)), 1);
        
        const runRate = spentAmount / elapsedDays; // Velocity
        const projectedTotal = runRate * totalDays; // Final forecast

        if (projectedTotal > budget.amount && spentAmount < budget.amount) {
            insights.push({
                type: 'warning',
                title: 'Budget Overrun Risk',
                message: `Based on your current habits, you are projected to spend $${Math.round(projectedTotal)} on ${budget.category.name}, exceeding your limit of $${budget.amount}. Consider cutting back this week.`
            });
        }
    }

    // --- 2. SPEND TREND DETECTION ALGORITHM ---
    // Compare High-Level velocity between last 30 days and the 30 days prior.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const last30Days = await Transaction.aggregate([
        { $match: { user: req.user._id, type: 'expense', date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const previous30Days = await Transaction.aggregate([
        { $match: { user: req.user._id, type: 'expense', date: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    // Analyze variance
    for (let current of last30Days) {
        const past = previous30Days.find(p => p._id.toString() === current._id.toString());
        const pastAmount = past ? past.total : 0;

        // If spend jumped more than 40% natively
        if (pastAmount > 0 && current.total > pastAmount * 1.4) {
            const categoryData = await Category.findById(current._id);
            const surgePercent = Math.round(((current.total - pastAmount) / pastAmount) * 100);
            
            insights.push({
                type: 'alert',
                title: 'High Growth Detection',
                message: `Caution: Spending on ${categoryData ? categoryData.name : 'a category'} surged by ${surgePercent}% compared to last month. Recommendation: Audit these specific transactions to reduce leakage.`
            });
        }
    }

    // --- 3. ZERO STATE METRIC ---
    if (insights.length === 0) {
        insights.push({
            type: 'success',
            title: 'Financially Healthy',
            message: 'All budgets are tracking safely and no abnormal spending surges detected. Keep it up!'
        });
    }

    res.json(insights);
});
