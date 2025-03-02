import { Router } from "express";
import CartServices from "../services/CartService";
import CartController from "../controllers/CartController";
import authMiddleware from "../middlewares/AuthMiddleware";

const cartRoutes = Router();
const cartService = new CartServices();
const cartController = new CartController(cartService);
const auth = new authMiddleware();

cartRoutes.use(auth.authenticated);
cartRoutes.get("/", (req, res) => cartController.getCart(req, res));
cartRoutes.post("/", (req, res) => cartController.addProductToCart(req, res));
cartRoutes.delete("/remove/:slug", (req, res) => cartController.removeProductFromCart(req, res));
cartRoutes.delete("/clear", (req, res) => cartController.removeAllProductsFromCart(req, res));

export default cartRoutes;