import mongoose from 'mongoose';

enum OrderStatus {
    PENDING = 'Pending',
    PAID = 'Paid',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_number: { type: String, required: true },
    order_items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    shipping_address: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    items_price: { type: Number, required: true },
    shipping_price: { type: Number, required: true },
    tax_price: { type: Number, required: true },
    total_price: { type: Number, required: true },
    payment_method: { type: String, required: true },
    payment_status: { type: String, required: true, default: OrderStatus.PENDING, enum: Object.values(OrderStatus) },
    paid_at: { type: Date },
    delivered_at: { type: Date },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);