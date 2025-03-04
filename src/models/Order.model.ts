import mongoose from 'mongoose';
import { PaymentMethod, PaymentStatus, OrderStatus } from '../utils/Enums';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String, required: true },
    order_number: { type: String, required: true },
    order_items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    shipping_address: {
        address: { type: String, required: true },
        city: { type: String},
        country: { type: String},
    },
    items_price: { type: Number, required: true },
    shipping_price: { type: Number,  default: 0  },
    tax_price: { type: Number, default: 0 },
    total_price: { type: Number, required: true },
    total_quantity: { type: Number, required: true },
    payment_method: { type: String, required: true,default: PaymentMethod.CASH, enum: Object.values(PaymentMethod) },
    payment_status: { type: String, required: true, default: PaymentStatus.PENDING, enum: Object.values(PaymentStatus) },
    order_status: { type: String, required: true, default: OrderStatus.PENDING, enum: Object.values(OrderStatus) },
    paid_at: { type: Date },
    delivered_at: { type: Date },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;