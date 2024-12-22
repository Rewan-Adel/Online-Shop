import { Router } from "express";
import {uploadSingle} from "../utils/multer";
import ProductController from "../controllers/ProductController";
import ProductService from "../services/ProductService";
import authMiddleware from "../middlewares/AuthMiddleware";

const productRoutes = Router();
const auth = new authMiddleware();
const productService = new ProductService();
const productController = new ProductController(productService);


// productRoutes.post("/", uploadSingle, (req, res) => productController.addProduct(req, res));
productRoutes.get("/",    (req, res) => productController.getProducts(req, res));
productRoutes.get("/:productID",    (req, res) => productController.getProduct(req, res));

productRoutes.use(auth.authenticated);

productRoutes.delete("/:productID", (req, res) => productController.deleteProduct(req, res));
productRoutes.delete("/", (req, res) => productController.deleteAllProducts(req, res));


productRoutes.use(auth.isAdmin);

export default productRoutes;