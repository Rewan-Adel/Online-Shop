import { Router } from "express";
import  AuthController from "../controllers/AuthController";
import  AuthServiceImpl from "../services/AuthService";
import EmailNotificationImp from "../utils/EmailSender";
import Encryption from "../shared/Encryption";
import Token from "../shared/Token";
import UserService from "../services/UserService";
const authRoutes = Router();

const encryption       = new Encryption();
const notification     = new EmailNotificationImp();
const token   = new Token();
const userService  = new UserService()

const signupService    = new AuthServiceImpl(userService, token, encryption, notification);
const signupController = new AuthController(signupService);


authRoutes.post("/signup", (req, res) => signupController.signup(req, res));
authRoutes.post("/verify-email", (req, res) => signupController.ValidateUserEmail(req, res));
authRoutes.post("/signup/resend-code", (req, res) => signupController.resendCodeForSignup(req, res));

authRoutes.post("/login", (req, res) => signupController.login(req, res));

authRoutes.post("/forgot-password", (req, res) => signupController.forgotPassword(req, res));
authRoutes.post("/reset-password/:userID/:resetToken", (req, res) => signupController.resetPassword(req, res));
authRoutes.post("/reset-password/resend-code", (req, res) => signupController.resendCodeForReset(req, res));

export default authRoutes;