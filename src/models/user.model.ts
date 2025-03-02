import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        require
    },
    email:{
        type: String,
        trim: true,
        require
    },
    password:{
        type: String,
        trim: true,
        require
    },
    avatar:{
        url:{
            type: String,
            default: process.env.DEFAULT_AVATAR_URL
        },
        public_id:{
            type: String,
            default:process.env.DEFAULT_AVATAR_PUBLIC_ID
        },
    },
    gender: { 
        type: String,
        enum: ["male", "female"] 
    },
    role:{
        type: String,
        enum: ["user","admin", "User", "Admin"],
        default: "user"
    },
    location:{
        longitude: {
            type: Number,
        },
        latitude: {
            type: Number,
        },
        city: {
            type: String,
            allowNull: true
        },
        state: {
            type: String,
            allowNull: true
        },
        country: {
            type: String,
            allowNull: true
        },
        fullAddress: {
            type: String,
        },
    },
    verified:{
        type: Boolean,
        default: false
    },
    active:{
        type: Boolean,
        default: false
    },
    wishlist:[
        {
            type: mongoose.Schema.ObjectId,
            ref : 'product',
            default: []
        }
    ],
    orders:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order'
        }
    ],

    otp:{
        type: String
    },
    otpCounter:{
        type: Number,
        default: 0
    },
    otpExpires:{
        type: Date
    },
    resetPasswordToken:{
        type: String
    },
},{
    timestamps: true,
    toJSON:{
        transform: function(doc, ret){
            delete ret.password;
            delete ret.otp;
            delete ret.otpCounter;
            delete ret.otpExpires
            delete ret.__v;
            delete ret.orders;
            delete ret.wishlist;
            delete ret.resetPasswordToken;
            delete ret.role;
            return ret;
        }
    }
});

userSchema.index({ email: 1 }, { unique: true, sparse: true });

userSchema.pre("save", async function(this: mongoose.Document & { password: string, isModified: (path: string) => boolean }, next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('user', userSchema);
export default User;