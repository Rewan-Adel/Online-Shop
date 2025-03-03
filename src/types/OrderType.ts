import { ObjectId } from "mongoose";

type OrderItemType = {
    product : ObjectId;
    quantity: number;
    price   : number;
};

type OrderType = {
    _id: ObjectId;
    user: ObjectId;
    order_number: string;
    order_items: OrderItemType[];
    shipping_address: object;
    items_price: number;
    shipping_price: number;
    tax_price: number;
    total_price: number;
    payment_method: string;
    payment_status: string;
    paid_at: Date | null;
    delivered_at: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export default OrderType;