import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';

// @desc    Get category comparison for Pie Charts
// @route   GET /api/analytics/categories
// @access  Private
export const getCategoryComparison = asyncHandler(async (req, res) => {
    // We utilize the highly advanced $lookup pipeline command to perform a native
    // JOIN operation entirely on the database side! This prevents node from sorting data locally.
    const categoryComparison = await Transaction.aggregate([
        { $match: { user: req.user._id, type: 'expense' } }, // Focus on expenses for Pie charts
        { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
        { 
            $lookup: { 
                from: 'categories', // The collection name in mongodb is intrinsically plural lowercased
                localField: '_id', 
                foreignField: '_id', 
                as: 'categoryData' 
            } 
        },
        { $unwind: '$categoryData' },
        { 
            $project: { 
                _id: 0, 
                category: '$categoryData.name', 
                icon: '$categoryData.icon', 
                color: '$categoryData.color', 
                totalAmount: 1 
            } 
        },
        { $sort: { totalAmount: -1 } } // Highest expenses render first
    ]);

    res.json(categoryComparison);
});

// @desc    Get macro-level yearly Bar Chart data
// @route   GET /api/analytics/yearly
// @access  Private
export const getYearlyTrend = asyncHandler(async (req, res) => {
    const yearlyTrend = await Transaction.aggregate([
        { $match: { user: req.user._id } },
        { 
            $group: { 
                _id: { 
                    year: { $year: "$date" },
                    type: "$type"
                }, 
                total: { $sum: '$amount' } 
            } 
        },
        { $sort: { "_id.year": 1 } }
    ]);

    // Format strictly for Frontend Graph UI
    const formattedYears = {};
    yearlyTrend.forEach(entry => {
        const year = entry._id.year;
        
        if (!formattedYears[year]) {
            formattedYears[year] = {
                year: year,
                income: 0,
                expense: 0
            };
        }
        
        if (entry._id.type === 'income') formattedYears[year].income = entry.total;
        if (entry._id.type === 'expense') formattedYears[year].expense = entry.total;
    });

    const chartDataArray = Object.values(formattedYears);

    res.json(chartDataArray);
});
