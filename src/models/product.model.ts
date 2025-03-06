import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{
        type: String
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
        type: Number
    },
    stock_num:{
        type: Number
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
        public_id: String
    },
    images:[{
        url: String,
        public_id: String
    }],
    
    variations:[{
        color:{
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
    timestamps: true,
    toJSON:{
        transform: function(doc, ret){
            delete ret.__v;
            return ret;
        }
    }
});

ProductSchema.index({ slug: 1 }, { unique: true, sparse: true });

const Product = mongoose.model("product", ProductSchema);
export default Product;
