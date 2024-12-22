import { Router } from "express";
import {uploadSingle} from "../utils/multer";
import CategoryController from "../controllers/CategoryController";
import CategoryService from "../services/CategoryService";
import authMiddleware from "../middlewares/AuthMiddleware";

const categoryRoutes = Router();
const auth = new authMiddleware();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);


categoryRoutes.get("/",    (req, res) => categoryController.getCategories(req, res));
categoryRoutes.get("/:categoryID",    (req, res) => categoryController.getCategory(req, res));

categoryRoutes.use(auth.authenticated);
categoryRoutes.use(auth.isAdmin);
categoryRoutes.post("/", uploadSingle, (req, res) => categoryController.addCategory(req, res));
categoryRoutes.delete("/:categoryID", (req, res) => categoryController.deleteCategory(req, res));

categoryRoutes.put("/change-image/:categoryID", uploadSingle, (req, res) => categoryController.changeImage(req, res));
categoryRoutes.put("/:categoryID", (req, res) => categoryController.updateCategory(req, res));
categoryRoutes.delete("/", (req, res) => categoryController.deleteAllCategories(req, res));


export default categoryRoutes;