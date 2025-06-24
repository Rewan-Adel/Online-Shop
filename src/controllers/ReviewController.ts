import ReviewService from "../services/ReviewService";
import { Request, Response } from "express";
import { successResponse, failedResponse, handleError } from "../middlewares/responseHandler";

class ReviewController {
    private reviewService: ReviewService;

    constructor(reviewService: ReviewService) {
        this.reviewService = reviewService;
    }

    async createReview(req: Request, res: Response): Promise<void> {
        try {
            const reviewData = req.body;
            const requiredFields = ['productId', 'userId', 'rating', 'title'];
            for (const field of requiredFields) {
                if (!reviewData[field]) {
                    res.status(400).json({ message: `Missing required field: ${field}` });
                    return;
                }
            }

            const newReview = await this.reviewService.createReview(reviewData);
            if (newReview) {
                successResponse(res, 201, "Review created successfully.", newReview);
            } else {
                failedResponse(res, 400, "Failed to create review. Please check the data.");
            }
        } catch (error) {
            console.error("Error creating review:", error);
            handleError(error, res);
        }
    }

    async getReviewById(req: Request, res: Response): Promise<void> {
        try {
            const reviewId = req.params.id;
            if (!reviewId) {
                return failedResponse(res, 400, "Review ID is required.");
            }
            const review = await this.reviewService.getReviewById(reviewId);
            if (review) {
               return successResponse(res, 200, "Review fetched successfully.", review);
            } else {
               return failedResponse(res, 404, "Review not found.");
            }           
        } catch (error) {
            console.error("Error fetching review:", error);
            handleError(error, res);}
    }

    async getAllReviews(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.query.productId;
            const reviews = await this.reviewService.getAllReviews(productId as string);
            return successResponse(res, 200, "Reviews fetched successfully.", reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return handleError(error, res);
        }
    }
}

export default ReviewController;