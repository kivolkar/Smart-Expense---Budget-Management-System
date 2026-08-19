import asyncHandler from 'express-async-handler';
import SavingGoal from '../models/SavingGoal.js';

// Internal Logic helper for Dynamic Statistics and Goal Prediction
const enrichGoal = (goal) => {
    const { targetAmount, currentAmount, createdAt } = goal;
    
    let remainingAmount = targetAmount - currentAmount;
    if (remainingAmount < 0) remainingAmount = 0;

    let percentageCompleted = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
    percentageCompleted = Math.round(percentageCompleted * 100) / 100;

    let estimatedCompletionDate = null;
    let averageDailySavings = 0;

    // PREDICTION ALGORITHM
    // 1. Calculate how many milliseconds have genuinely passed since the goal was created
    const msElapsed = Date.now() - new Date(createdAt).getTime();
    // 2. Convert to days (ensuring we avoid divide by zero if created literally right now)
    const daysElapsed = Math.max((msElapsed / (1000 * 60 * 60 * 24)), 1);

    if (currentAmount > 0 && remainingAmount > 0) {
        // 3. Figure out how much money they save per day on average
        averageDailySavings = currentAmount / daysElapsed;
        // 4. Calculate how many days are left based on their speed
        const daysRemaining = remainingAmount / averageDailySavings;
        // 5. Mathematically construct a future date from now
        const estimatedTimestamp = Date.now() + (daysRemaining * 1000 * 60 * 60 * 24);
        estimatedCompletionDate = new Date(estimatedTimestamp);
    } else if (remainingAmount === 0) {
        estimatedCompletionDate = new Date(); // It is already finished
    }

    // Determine status check
    let dynamicStatus = goal.status;
    if (remainingAmount <= 0) {
        dynamicStatus = 'completed'; 
    }

    return {
        ...goal._doc,
        status: dynamicStatus, // Overwrite with dynamic calculated status
        remainingAmount,
        percentageCompleted,
        estimatedCompletionDate,
        averageDailySavings: Math.round(averageDailySavings * 100) / 100
    };
};

// @desc    Create new saving goal
// @route   POST /api/saving-goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
    const { name, targetAmount, currentAmount, targetDate } = req.body;

    if (new Date(targetDate) < new Date()) {
        res.status(400);
        throw new Error('Target date must be in the future');
    }

    const goal = new SavingGoal({
        user: req.user._id,
        name,
        targetAmount,
        currentAmount: currentAmount || 0,
        targetDate
    });

    const createdGoal = await goal.save();
    
    // We run it through the enrichment algorithm before answering the frontend
    res.status(201).json(enrichGoal(createdGoal));
});

// @desc    Get all saving goals
// @route   GET /api/saving-goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
    const goals = await SavingGoal.find({ user: req.user._id }).sort({ targetDate: 1 });
    
    // Transform the raw Array with our mathematical enrichment engine
    const enrichedGoals = goals.map(goal => enrichGoal(goal));
    
    res.json(enrichedGoals);
});

// @desc    Get single saving goal
// @route   GET /api/saving-goals/:id
// @access  Private
export const getGoalById = asyncHandler(async (req, res) => {
    const goal = await SavingGoal.findById(req.params.id);

    if (goal) {
        if (goal.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to access this saving goal');
        }
        res.json(enrichGoal(goal));
    } else {
        res.status(404);
        throw new Error('Saving Goal not found');
    }
});

// @desc    Update a saving goal (Edit or Contribute)
// @route   PUT /api/saving-goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
    const goal = await SavingGoal.findById(req.params.id);

    if (goal) {
        if (goal.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this saving goal');
        }

        const { name, targetAmount, currentAmount, targetDate, status } = req.body;

        goal.name = name || goal.name;
        goal.targetAmount = targetAmount ?? goal.targetAmount;
        
        // This is how they update contributions (e.g. saving another $50)
        goal.currentAmount = currentAmount ?? goal.currentAmount;
        
        goal.targetDate = targetDate || goal.targetDate;
        goal.status = status || goal.status;

        const updatedGoal = await goal.save();
        res.json(enrichGoal(updatedGoal));
    } else {
        res.status(404);
        throw new Error('Saving Goal not found');
    }
});

// @desc    Delete a saving goal
// @route   DELETE /api/saving-goals/:id
// @access  Private
export const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await SavingGoal.findById(req.params.id);

    if (goal) {
        if (goal.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this saving goal');
        }

        await goal.deleteOne();
        res.json({ message: 'Saving Goal removed' });
    } else {
        res.status(404);
        throw new Error('Saving Goal not found');
    }
});
