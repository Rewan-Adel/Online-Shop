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
        unique: true,
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
            default:"https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg"
        },
        public_id:{
            type: String,
            default:"default_j5ftby_jspjve"
        },
    },
    gender: { 
        type: String,
        enum: ["male", "Male", "Female", "female"] 
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
        },
        state: {
            type: String,
        },
        country: {
            type: String,
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
    cart:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'cart'
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
            delete ret.cart;
            delete ret.orders;
            delete ret.wishlist;
            delete ret.resetPasswordToken;
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