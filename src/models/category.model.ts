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
        type: mongoose.Types.ObjectId
    }
},{
    timestamps: true
});

const Category = mongoose.model("category", CategorySchema);
export default Category;
