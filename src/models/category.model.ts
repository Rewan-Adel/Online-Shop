import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        require
    },
    image:{
        url: String,
        public_id: String
    },
    parent:{
        type: mongoose.Types.ObjectId,
        ref: 'category' 
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

const Category = mongoose.model("category", CategorySchema);
export default Category;
