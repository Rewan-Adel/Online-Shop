import { Router } from "express";
import UserController from "../controllers/UserController";
import UserService from "../services/UserService";
import authMiddleware from "../middlewares/AuthMiddleware"; 
import {uploadSingle} from "../utils/multer";

const userRoutes = Router();
const auth       = new authMiddleware();

const userService = new UserService();
const userController = new UserController(userService);

userRoutes.use(auth.authenticated);
userRoutes.get("/profile", (req, res) => userController.getProfile(req, res));
userRoutes.put("/profile", (req, res) => userController.updateProfile(req, res));
userRoutes.delete("/profile", (req, res) => userController.deleteProfile(req, res));

userRoutes.put("/avatar",uploadSingle, (req, res) => userController.changeAvatar(req, res));
userRoutes.delete("/avatar", (req, res) => userController.deleteAvatar(req, res));

/**
 * Admin Routes
 */
userRoutes.use(auth.isAdmin);
userRoutes.get("/", (req, res) => userController.getAllUsers(req, res));
userRoutes.get("/:userID", (req, res) => userController.getUser(req, res));
userRoutes.put("/disable/:userID", (req, res) => userController.disableUser(req, res));
userRoutes.put("/enable/:userID", (req, res) => userController.enableUser(req, res));
userRoutes.delete("/", (req, res) => userController.deleteAllUsers(req, res));

export default userRoutes;

