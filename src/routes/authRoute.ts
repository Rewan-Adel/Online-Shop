import { Router } from "express";
import  AuthController from "../controllers/AuthController";
import  AuthServiceImpl from "../services/AuthService";
import EmailSender from "../utils/EmailSender";
import Encryption from "../utils/Encryption";
import Token from "../utils/Token";
const authRoutes = Router();

const encryption       = new Encryption();
const notification     = new EmailSender();
const token            = new Token();

const signupService    = new AuthServiceImpl(token, encryption, notification);
const signupController = new AuthController(signupService);


authRoutes.post("/signup", (req, res) => signupController.signup(req, res));
authRoutes.post("/verify-email", (req, res) => signupController.ValidateUserEmail(req, res));
authRoutes.post("/resend-code", (req, res) => signupController.resendCodeForSignup(req, res));

authRoutes.post("/login", (req, res) => signupController.login(req, res));

authRoutes.post("/forgot-password", (req, res) => signupController.forgotPassword(req, res));
authRoutes.post("/reset-password/:userID/:resetToken", (req, res) => signupController.resetPassword(req, res));
authRoutes.post("/reset-password/resend-code", (req, res) => signupController.resendCodeForReset(req, res));

export default authRoutes;