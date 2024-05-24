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
    tags: [String], // Optional list of tags
    desiredItems: [String], // Optional list of desired item types/categories
    visible: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;
