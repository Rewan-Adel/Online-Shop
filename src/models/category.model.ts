import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
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
CategorySchema.index({name: 1}, {unique: true});
const Category = mongoose.model("category", CategorySchema);
export default Category;
