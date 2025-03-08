import { Router } from "express";
import UserController from "../controllers/UserController";
import UserService from "../services/UserService";
import authMiddleware from "../middlewares/AuthMiddleware"; 
import Multer from "../utils/multer";
import AuthService from "../services/AuthService";
import EmailSender from "../utils/EmailSender";
import Encryption from "../utils/Encryption";
import Token from "../utils/Token";

const userRoutes = Router();

const auth           = new authMiddleware();
const authService    = new AuthService(new Token(), new Encryption(), new EmailSender());
const userService    = new UserService(authService);
const userController = new UserController(userService);

userRoutes.use(auth.authenticated);
userRoutes.get("/is-active/:userID", (req, res) => userController.checkUserActivity(req, res));
userRoutes.get("/profile", (req, res) => userController.getProfile(req, res));
userRoutes.put("/profile", (req, res) => userController.updateProfile(req, res));
userRoutes.delete("/profile", (req, res) => userController.deleteProfile(req, res));

userRoutes.put("/avatar",Multer.uploadSingle, (req, res) => userController.changeAvatar(req, res));
userRoutes.delete("/avatar", (req, res) => userController.deleteAvatar(req, res));

userRoutes.put("/change-email", (req, res) => userController.changeEmail(req, res));
/**
 * Admin Routes
 */
userRoutes.use(auth.isAdmin);

userRoutes.get("/",               (req, res) => userController.getAllUsers(req, res));
userRoutes.get("/:userID",        (req, res) => userController.getUser(req, res));
userRoutes.get("/filter/all",     (req, res)=> userController.filterUsers(req, res));
userRoutes.get("/filter/status/", (req, res)=> userController.filterByStatus(req, res));

userRoutes.put("/disable/:userID", (req, res) => userController.disableUser(req, res));
userRoutes.put("/enable/:userID",  (req, res) => userController.enableUser(req, res));

userRoutes.delete("/",             (req, res) => userController.deleteAllUsers(req, res));
userRoutes.delete("/:userID",      (req, res) => userController.deleteUser(req, res));

export default userRoutes;

