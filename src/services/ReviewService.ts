import ReviewRepository from "../repositories/ReviewRepository";
import ReviewType from '../types/ReviewType';
import Review from "../models/Review.model";
import Product from "../models/product.model";
import User from "../models/user.model";

class ReviewService implements ReviewRepository {

    async createReview(reviewData: ReviewType): Promise<ReviewType | null> {
       try{
           if (!reviewData.productId || !reviewData.userId || !reviewData.rating || !reviewData.title || !reviewData.content) {
               throw new Error("Missing required fields for review creation.");
            }
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
}

export default ReviewService;