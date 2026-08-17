import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
export const createCategory = asyncHandler(async (req, res) => {
    const { name, type, icon } = req.body;

    const category = new Category({
        user: req.user._id,
        name,
        type,
        icon
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
});

// @desc    Get all categories for user
// @route   GET /api/categories
// @access  Private
export const getCategories = asyncHandler(async (req, res) => {
    // Only return categories tied to this specific user ID
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Private
export const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        // Ownership Anti-Tampering Check
        if (category.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to access this category');
        }
        res.json(category);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        // Ownership Anti-Tampering Check
        if (category.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this category');
        }

        category.name = req.body.name || category.name;
        category.type = req.body.type || category.type;
        category.icon = req.body.icon !== undefined ? req.body.icon : category.icon;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        // Ownership Anti-Tampering Check
        if (category.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this category');
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});
