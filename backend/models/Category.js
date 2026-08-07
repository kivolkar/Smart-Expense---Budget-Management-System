import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    icon: {
        type: String,
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
