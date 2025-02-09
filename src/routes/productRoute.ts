import { Router }                  from "express";
import {uploadSingle, uploadArray} from "../utils/multer";
import ProductController           from "../controllers/ProductController";
import ProductService              from "../services/ProductService";
import authMiddleware              from "../middlewares/AuthMiddleware";

const productRoutes     = Router();
const auth              = new authMiddleware();
const productService    = new ProductService();
const productController = new ProductController(productService);

/**
 * Routes for products
 */
productRoutes.get("/all",   (req, res) => productController.getProducts(req, res));
productRoutes.get("/:slug", (req, res) => productController.getProduct(req, res));

productRoutes.use(auth.authenticated);
productRoutes.use(auth.isAdmin);

productRoutes.post("/",             uploadSingle, (req, res) => productController.addProduct(req, res));
productRoutes.post("/upload/:slug", uploadArray,  (req, res) => productController.addProductImages(req, res));

productRoutes.put("/:slug",         uploadSingle, (req, res) => productController.updateProduct(req, res));

productRoutes.delete("/",      (req, res) => productController.deleteAllProducts(req, res));
productRoutes.delete("/:slug", (req, res) => productController.deleteProduct(req, res));

export default productRoutes;