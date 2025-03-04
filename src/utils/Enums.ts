enum OrderStatus {
    PENDING   = 'Pending',
    SHIPPED   = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
};

enum PaymentStatus {
    PENDING   = 'Pending',
    PAID      = 'Paid',
    CANCELLED = 'Cancelled'
}

enum PaymentMethod {
    PAYPAL = 'Paypal',
    STRIPE = 'Stripe',
    CASH   = 'Cash'
}


export { OrderStatus, PaymentStatus, PaymentMethod };