import asyncHandler from 'express-async-handler';
import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = asyncHandler(async (req, res) => {
    const { category, amount, startDate, endDate } = req.body;

    const categoryExists = await Category.findById(category);
    
    if (!categoryExists) {
        res.status(404);
        throw new Error('Category not found');
    }

    if (categoryExists.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to use this category');
    }

    // Prevent corrupt backwards timeframes
    if (new Date(startDate) > new Date(endDate)) {
        res.status(400);
        throw new Error('Start date cannot accurately be after end date');
    }

    const budget = new Budget({
        user: req.user._id,
        category,
        amount,
        startDate,
        endDate
    });

    const createdBudget = await budget.save();
    res.status(201).json(createdBudget);
});

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
// @advanced Uses transaction pipeline to append accurate spentAmount + calculation metrics
export const getBudgets = asyncHandler(async (req, res) => {
    const rawBudgets = await Budget.find({ user: req.user._id }).populate('category', 'name type icon');

    // Advanced: Iterate each budget and calculate the exact amount spent in its timeframe
    const budgetsWithSpent = await Promise.all(rawBudgets.map(async (budget) => {
        // Aggregate only specific transactions matching the category and time window!
        const summary = await Transaction.aggregate([
            {
                $match: { 
                    user: req.user._id,
                    type: 'expense',
                    category: budget.category._id,
                    date: { $gte: budget.startDate, $lte: budget.endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$amount' }
                }
            }
        ]);

        const spentAmount = summary.length > 0 ? summary[0].totalSpent : 0;
        
        // --- ADVANCED METRICS MODULE ---
        const remainingAmount = budget.amount - spentAmount;
        let percentageUsed = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;
        percentageUsed = Math.round(percentageUsed * 100) / 100; // Round strictly to 2 decimal points
        const isExceeded = spentAmount > budget.amount;

        // Reconstruct the response replacing mongoose wrapper with pure JSON
        return {
            ...budget._doc,
            spentAmount,
            remainingAmount,
            percentageUsed,
            isExceeded
        };
    }));

    res.json(budgetsWithSpent);
});

// @desc    Get single budget by ID
// @route   GET /api/budgets/:id
// @access  Private
export const getBudgetById = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id).populate('category', 'name type icon');

    if (budget) {
        if (budget.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to access this budget');
        }
        
        // Single budget spent-calc
        const summary = await Transaction.aggregate([
            {
                $match: { 
                    user: req.user._id,
                    type: 'expense',
                    category: budget.category._id,
                    date: { $gte: budget.startDate, $lte: budget.endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$amount' }
                }
            }
        ]);

        const spentAmount = summary.length > 0 ? summary[0].totalSpent : 0;
        
        // --- ADVANCED METRICS MODULE ---
        const remainingAmount = budget.amount - spentAmount;
        let percentageUsed = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;
        percentageUsed = Math.round(percentageUsed * 100) / 100;
        const isExceeded = spentAmount > budget.amount;

        res.json({
            ...budget._doc,
            spentAmount,
            remainingAmount,
            percentageUsed,
            isExceeded
        });
    } else {
        res.status(404);
        throw new Error('Budget not found');
    }
});

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);

    if (budget) {
        if (budget.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this budget');
        }

        const { category, amount, startDate, endDate } = req.body;

        if (category && category !== budget.category.toString()) {
            const categoryExists = await Category.findById(category);
            
            if (!categoryExists || categoryExists.user.toString() !== req.user._id.toString()) {
                res.status(400);
                throw new Error('Invalid category selected');
            }
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            res.status(400);
            throw new Error('Start date cannot accurately be after end date');
        }

        budget.category = category || budget.category;
        budget.amount = amount ?? budget.amount;
        budget.startDate = startDate || budget.startDate;
        budget.endDate = endDate || budget.endDate;

        const updatedBudget = await budget.save();
        res.json(updatedBudget);
    } else {
        res.status(404);
        throw new Error('Budget not found');
    }
});

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);

    if (budget) {
        if (budget.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this budget');
        }

        await budget.deleteOne();
        res.json({ message: 'Budget removed' });
    } else {
        res.status(404);
        throw new Error('Budget not found');
    }
});
