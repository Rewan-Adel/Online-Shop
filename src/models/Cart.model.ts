import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        unique: true,
        required: true,
        ref: 'User'
    },
    products: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'product'
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total_price: {
        type: Number,
        required: true
    },
    total_quantity: {
        type: Number,
        required: true
    },
    discount_number:{
        type: Number
    },
    discount_type:{
        type: String
    }
},{
    timestamps: true
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;