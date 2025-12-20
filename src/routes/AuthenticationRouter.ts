import { Router } from "express";
import { AuthenticationController } from "@/controllers/AuthenticationController";
import { AuthenticationServices } from "@/services/AuthenticationServices";
import { AuthenticationRepository } from "@/repositories/AuthenticationRepository";

const router = Router();

const authenticationRepository = new AuthenticationRepository();
const authenticationService = new AuthenticationServices(authenticationRepository);
const authenticationController = new AuthenticationController(authenticationService);

router.post("/login", authenticationController.login);

export default router;
