import { Router } from "express";
import { AuthenticationController } from "@/controllers/AuthenticationController";
import { AuthenticationServices } from "@/services/AuthenticationServices";
import { AuthenticationRepository } from "@/repositories/AuthenticationRepository";

import { authenticateToken } from "@/middleware/auth";

const router = Router();

const authenticationRepository = new AuthenticationRepository();
const authenticationService = new AuthenticationServices(authenticationRepository);
const authenticationController = new AuthenticationController(authenticationService);

router.post("/login", authenticationController.login);
router.post("/logout", authenticationController.logout);
router.post("/update-password", authenticateToken, authenticationController.updatePassword);
router.get("/profile", authenticateToken, authenticationController.profile);

export default router;
