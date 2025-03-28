import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    userPic: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    pdfId: [{
        type: String, // Array of URLs as strings
        required: true
    }],
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    quantity: {
        type: Number,
        required: true
    },
    shopName: {
        type: String,
    },
    shopPic: {
        type: String,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    sides: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;