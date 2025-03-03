enum Status {
    PENDING   = 'Pending',
    PAID      = 'Paid',
    SHIPPED   = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
};

enum PaymentMethod {
    PAYPAL = 'Paypal',
    STRIPE = 'Stripe',
    CASH   = 'Cash'
}


export { Status, PaymentMethod };