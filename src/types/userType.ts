import { Types } from "mongoose";

type Location = {
    longitude?: number;
    latitude?: number;
    city?: string;
    state?: string;
    country?: string;
    fullAddress?: string;
}

type Avatar = {
    url: string;
    public_id: string;
}

type UserType = {
    _id:  Types.ObjectId;
    username: string;
    email: string;
    password: string;
    avatar: Avatar;
    gender?: "male" | "female" | "Male" | "Female";
    role: "user" | "admin" | "User" | "Admin";
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
