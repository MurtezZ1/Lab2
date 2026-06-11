import { Router } from "express";
import { subscribeNewsletterController } from "../controllers/newsletterController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateNewsletterSubscription } from "../validators/newsletterValidator.js";

const router = Router();

router.post("/subscribe", validateRequest(validateNewsletterSubscription), subscribeNewsletterController);

export default router;
