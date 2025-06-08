import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
