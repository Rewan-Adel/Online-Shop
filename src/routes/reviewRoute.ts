import { Router }       from "express";
import ReviewController from "../controllers/ReviewController";
import ReviewService    from "../services/ReviewService";
import authMiddleware   from "../middlewares/AuthMiddleware";

const reviewRoutes     = Router();
const auth              = new authMiddleware();
const reviewController = new ReviewController(new ReviewService());

reviewRoutes.use(auth.authenticated);
reviewRoutes.post("/", (req, res) => reviewController.createReview(req, res));
reviewRoutes.get("/:reviewId", (req, res) => reviewController.getReviewById(req, res));
reviewRoutes.get("/product/:productId", (req, res) => reviewController.getAllReviews(req, res));

export default reviewRoutes;