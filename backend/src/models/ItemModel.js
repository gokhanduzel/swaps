import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [String], // Array of image URLs
    category: {
        type: String,
        required: true
    },
    desiredItems: [String], // Optional list of desired item types/categories
    status: {
        type: String,
        default: 'available', // Other values can be 'swapped' or 'unavailable'
        required: true
    }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;
