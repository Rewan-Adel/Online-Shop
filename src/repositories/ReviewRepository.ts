import  ReviewType from '../types/ReviewType';

interface ReviewRepository {
    createReview(reviewData: ReviewType): Promise<ReviewType | null>;
    getReviewById(reviewId: string): Promise<ReviewType | null>;
    getAllReviews(productId: string): Promise<ReviewType[]>;
    // replyReview(reviewId: string, replyData: { userId: string; content: string }): Promise<boolean>;
}

export default ReviewRepository;