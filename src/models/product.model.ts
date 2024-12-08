import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        require
    },
    slug:{
        type: String
    },
    brand:{
        type: String
    },
    description:{
        type: String
    },
    original_price:{
        type: Number,
        require
    },
    stock_num:{
        type: Number,
        require
    },
    avg_rating:{
        type: Number
    },
    available:{
        type: Boolean
    },
    isOffered:{
        type: Boolean
    },

    main_image:{
        url: String,
        public_id: String,
        require
    },
    images:[{
        url: String,
        public_id: String
    }],
    
    variations:[{
        color:{
            id         : Number, 
            hexadecimal: String, 
            plus_price : Number, 
            stock_num  : Number 
        },
        size: String
    }],

    category:{
        type: mongoose.Types.ObjectId
    },
    offer:{
        type: mongoose.Types.ObjectId
    },
    reviews:{
        type: mongoose.Types.ObjectId
    }
},{
    timestamps: true
});

ProductSchema.index({ slug: 1 }, { unique: true, sparse: true });

const Product = mongoose.model("product", ProductSchema);
export default Product;
