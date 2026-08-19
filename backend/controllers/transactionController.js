import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';

// @desc    Get income, expense and balance totals
// @route   GET /api/transactions/summary
// @access  Private
export const getTransactionSummary = asyncHandler(async (req, res) => {
    // We use the advanced MongoDB Aggregation Pipeline to mathematically fold the data instantly!
    const summary = await Transaction.aggregate([
        {
            $match: { user: req.user._id } // Only aggregate this specific user's logic
        },
        {
            $group: {
                _id: '$type', // Group into exactly two piles: 'income' and 'expense'
                totalAmount: { $sum: '$amount' } // Add all the values in each pile together
            }
        }
    ]);

    // Format the raw aggregation array into a clean JSON object for the frontend
    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach(item => {
        if (item._id === 'income') totalIncome = item.totalAmount;
        if (item._id === 'expense') totalExpense = item.totalAmount;
    });

    res.json({
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
    });
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req, res) => {
    const { amount, type, category, paymentMethod, description, date } = req.body;
    let receiptUrl = null;
    
    // If Multer successfully intercepted a file, save the path
    if (req.file) {
        receiptUrl = `/uploads/${req.file.filename}`;
    }

    // Validate if the category exists and belongs to the user
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
        receiptUrl, // Saving the new file URL
        description,
        date: date || Date.now()
    });

    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
});

// @desc    Get all transactions for user (with dynamic filtering, search & pagination)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
    const { category, type, paymentMethod, startDate, endDate, search, sort, page = 1, limit = 10 } = req.query;

    let query = { user: req.user._id };

    if (category) query.category = category;
    if (type) query.type = type;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    // Keyword Search targeting the text description securely via regex
    if (search) {
        query.description = { $regex: search, $options: 'i' };
    }

    // Dynamic Database Sorting
    let sortObj = { date: -1 }; 
    if (sort === 'oldest') sortObj = { date: 1 };
    if (sort === 'amount_high') sortObj = { amount: -1 };
    if (sort === 'amount_low') sortObj = { amount: 1 };

    // Mathematics for Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
        .populate('category', 'name type icon')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit)); 

    res.json({
        transactions,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        }
    });
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
        
        // If a new file is uploaded, overwrite the old URL
        if (req.file) {
            transaction.receiptUrl = `/uploads/${req.file.filename}`;
        }

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

        // Ideally in a production app you'd also write an fs.unlinkSync to delete the 
        // the local file inside uploads/ so they don't pile up, but for now this is fine.
        await transaction.deleteOne();
        res.json({ message: 'Transaction removed' });
    } else {
        res.status(404);
        throw new Error('Transaction not found');
    }
});
