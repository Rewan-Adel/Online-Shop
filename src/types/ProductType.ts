import { Types } from "mongoose";

type Image = {
    url: string;
    public_id: string;
}

type ProductType = {
    _id:  Types.ObjectId;
    name: string,
    description:string,
    category: string,
    brand: string,
    price: number,
    images:[Image],
    stock_num: number;
    active: boolean;
    isOffered: boolean;
    offer: Types.ObjectId;
    reviews: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
};

export default ProductType;