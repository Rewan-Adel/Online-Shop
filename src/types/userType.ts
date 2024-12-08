import { Types } from "mongoose";
import Image from "./ImageType";

type Location = {
    longitude?: number;
    latitude?: number;
    city?: string;
    state?: string;
    country?: string;
    fullAddress?: string;
}



type UserType = {
    _id:  Types.ObjectId;
    username: string;
    email: string;
    password: string;
    avatar: Image;
    gender?: "male" | "female" ;
    role: "user" | "admin" ;
    location?: Location;
    verified: boolean;
    active: boolean;
    wishlist: Types.ObjectId[];
    cart: Types.ObjectId[];
    orders: Types.ObjectId[];
    otp?: string;
    otpCounter?: number;
    otpExpires?: Date;
    resetPasswordToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

export default UserType;
