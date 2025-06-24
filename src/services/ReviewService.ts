import ReviewRepository from "../repositories/ReviewRepository";
import ReviewType from '../types/ReviewType';
import Review from "../models/Review.model";
import Product from "../models/product.model";
import User from "../models/user.model";

class ReviewService implements ReviewRepository {

    async createReview(reviewData: ReviewType): Promise<ReviewType | null> {
       try{
            if (reviewData.rating < 1 || reviewData.rating > 5) {
              throw new Error("Rating must be between 1 and 5.");
            }
            
            // Check if the product exists
            const productExists = await Product.findById(reviewData.productId);
            if (!productExists) {
                throw new Error("Product does not exist.");
            }

              // Check if the user exists
            const userExists = await User.findById(reviewData.userId);
            if (!userExists) {
                throw new Error("User does not exist.");
            }

           const newReview = new Review(reviewData);
           await newReview.save();
           return newReview as unknown as ReviewType;

       }catch(error: unknown){
              if (error instanceof Error) {
                console.error("Error creating review:", error.message);
              } else {
                console.error("An unknown error occurred while creating review.");
              }
              return null;
       }
    }

    async getReviewById(reviewId: string): Promise<ReviewType | null> {
        try {
            const review = await Review.findById(reviewId).populate('userId', 'name email').populate('productId', 'name');
            if (!review) {
               return null; 
            }
            return review as unknown as ReviewType;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching review:", error.message);
            } else {
                console.error("An unknown error occurred while fetching review.");
            }
            return null;
        }
    }

    async getAllReviews(productId: string): Promise<ReviewType[]>{
        try {
            const reviews = await Review.find({ productId }).populate('userId', '_id name email').populate('productId', '_id name');
            return reviews as unknown as ReviewType[];
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching reviews:", error.message);
            } else {
                console.error("An unknown error occurred while fetching reviews.");
            }
            return [];
        }
    }
    
}

export default ReviewService;