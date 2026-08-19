import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';
import SavingGoal from '../models/SavingGoal.js';

// @desc    Get master dashboard metrics and time-series logic
// @route   GET /api/dashboard
// @access  Private
// @advanced Automatically merges transactions and saving goals natively
export const getDashboardData = asyncHandler(async (req, res) => {
    // Fire all three big database queries simultaneously for optimal latency logic!
    const [transactionSummary, savingSummary, monthlyOverview] = await Promise.all([
        // 1. Transaction Summary
        Transaction.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$type', totalAmount: { $sum: '$amount' } } }
        ]),
        // 2. Savings Summary
        SavingGoal.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: null, totalSavings: { $sum: '$currentAmount' } } }
        ]),
        // 3. Monthly Overview (Time-Series)
        Transaction.aggregate([
            { $match: { user: req.user._id } },
            { 
                $group: { 
                    _id: { 
                        month: { $month: "$date" }, 
                        year: { $year: "$date" },
                        type: "$type"
                    }, 
                    total: { $sum: '$amount' } 
                } 
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ])
    ]);

    // Format Data 1: Master Income / Expense
    let totalIncome = 0;
    let totalExpense = 0;
    transactionSummary.forEach(item => {
        if (item._id === 'income') totalIncome = item.totalAmount;
        if (item._id === 'expense') totalExpense = item.totalAmount;
    });
    const currentBalance = totalIncome - totalExpense;

    // Format Data 2: Master Savings
    const totalSavings = savingSummary.length > 0 ? savingSummary[0].totalSavings : 0;

    // Format Data 3: Structuring the array for Graph injection
    // The raw output gives us pieces. We should merge them into Javascript payload objects like 
    // { month: 1, year: 2024, income: 500, expense: 200 }
    
    // First, map the months into a dictionary
    const formattedMonths = {};
    monthlyOverview.forEach(entry => {
        const key = `${entry._id.year}-${entry._id.month}`; // e.g. "2024-1"
        if (!formattedMonths[key]) {
            formattedMonths[key] = {
                year: entry._id.year,
                month: entry._id.month,
                income: 0,
                expense: 0
            };
        }
        
        if (entry._id.type === 'income') formattedMonths[key].income = entry.total;
        if (entry._id.type === 'expense') formattedMonths[key].expense = entry.total;
    });

    // Convert the dictionary back to a sorted Array
    const chartDataArray = Object.values(formattedMonths).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });

    res.json({
        currentBalance,
        totalIncome,
        totalExpense,
        totalSavings,
        monthlyOverview: chartDataArray
    });
});
