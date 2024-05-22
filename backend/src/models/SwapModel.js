import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
    item1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    item2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    user1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: 'pending', // Other statuses can be 'accepted', 'rejected'
        required: true
    }
}, { timestamps: true });

const Swap = mongoose.model('Swap', swapSchema);
export default Swap;
