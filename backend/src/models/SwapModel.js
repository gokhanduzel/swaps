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
        default: 'pending', // pending, accepted, declined
        required: true
    },
    message: {
        type: String,
        required: true
    },
    chatId: { // Linking the swap to a chat document when the swap is accepted
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: false // Only required after a swap is accepted
    }
}, { timestamps: true });

const Swap = mongoose.model('Swap', swapSchema);
export default Swap;
