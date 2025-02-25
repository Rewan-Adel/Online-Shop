import { Types } from "mongoose";

type CartType = {
    _id: string;
    userId: Types.ObjectId;
    products: {
        product: Types.ObjectId;
        quantity: number;
    }[];
    total_price: number;
    total_quantity: number;
    discount_number?: number;
    discount_type?: string;
    createdAt: Date;
    updatedAt: Date;
};

export default CartType;