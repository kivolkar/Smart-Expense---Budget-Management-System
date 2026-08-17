import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req, res) => {
    const { amount, type, category, paymentMethod, description, date } = req.body;

    // Validate if the category exists and belongs to the user
    // This is the relational check to prevent spoofing
    const categoryExists = await Category.findById(category);
    
    if (!categoryExists) {
        res.status(404);
        throw new Error('Category not found');
    }

    if (categoryExists.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to use this category');
    }

    const transaction = new Transaction({
        user: req.user._id,
        amount,
        type,
        category,
        paymentMethod,
        description,
        date: date || Date.now()
    });

    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
});

// @desc    Get all transactions for user (with dynamic filtering)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
    const { category, type, paymentMethod, startDate, endDate } = req.query;

    // Build the query object starting with the required user filter
    let query = { user: req.user._id };

    // Apply optional filters if they exist in the request query
    if (category) query.category = category;
    if (type) query.type = type;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    
    // Apply date range filter if provided
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    // Populate replaces the category ID string with an object containing name, type & icon!
    // Sorting by date -1 ensures newest transactions are at the top
    const transactions = await Transaction.find(query)
        .populate('category', 'name type icon')
        .sort({ date: -1 }); 

    res.json(transactions);
});

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id).populate('category', 'name type icon');

    if (transaction) {
        if (transaction.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to access this transaction');
        }
        res.json(transaction);
    } else {
        res.status(404);
        throw new Error('Transaction not found');
    }
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction) {
        if (transaction.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this transaction');
        }

        const { amount, type, category, paymentMethod, description, date } = req.body;

        // If user is attempting to change the category, we must re-validate it!
        if (category && category !== transaction.category.toString()) {
            const categoryExists = await Category.findById(category);
            
            if (!categoryExists || categoryExists.user.toString() !== req.user._id.toString()) {
                res.status(400);
                throw new Error('Invalid category selected. Category does not exist or belong to user.');
            }
        }

        transaction.amount = amount ?? transaction.amount;
        transaction.type = type || transaction.type;
        transaction.category = category || transaction.category;
        transaction.paymentMethod = paymentMethod || transaction.paymentMethod;
        transaction.description = description !== undefined ? description : transaction.description;
        transaction.date = date || transaction.date;

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } else {
        res.status(404);
        throw new Error('Transaction not found');
    }
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction) {
        if (transaction.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this transaction');
        }

        await transaction.deleteOne();
        res.json({ message: 'Transaction removed' });
    } else {
        res.status(404);
        throw new Error('Transaction not found');
    }
});
