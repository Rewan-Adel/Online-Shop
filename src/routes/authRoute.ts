import { Router } from "express";
import  AuthController from "../controllers/AuthController";
import  AuthServiceImpl from "../services/AuthServiceImpl";
import  codeServiceImpl  from "../services/codeServiceImp";

import EmailNotificationImp from "../services/EmailNotificationImp";
import VerificationCodeController from "../controllers/verificationCodeController";
import EncryptionService from "../utils/EncryptionService";
import TokenService from "../services/TokenService";
const authRoutes = Router();

const encryption       = new EncryptionService();
const notification     = new EmailNotificationImp();
const tokenServiceInstance = new TokenService();
const verificationCodeService    = new codeServiceImpl(encryption, notification);
const verificationCodeController = new VerificationCodeController(verificationCodeService);

const signupService    = new AuthServiceImpl(tokenServiceInstance, encryption, verificationCodeService, notification);
const signupController = new AuthController(signupService);


authRoutes.post("/signup", (req, res) => signupController.signup(req, res));
authRoutes.post("/verify-email", (req, res) => verificationCodeController.codeVerifier(req, res));
authRoutes.post("/resend-code", (req, res) => signupController.resendCode(req, res));

authRoutes.post("/login", (req, res) => signupController.login(req, res));

authRoutes.post("/forgot-password", (req, res) => signupController.forgotPassword(req, res));
authRoutes.post("/reset-password", (req, res) => signupController.resetPassword(req, res));

export default authRoutes;