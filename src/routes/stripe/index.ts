import { Router } from "express";
import { verifyAuthentication, verifyAuthorization } from "../../middlewares/auth.js";
import { createPaymentIntent, getPublishableKey } from "./stripeController.js";


const router = Router();

router.get('/publishable-key', getPublishableKey);
router.post('/payment-sheet', createPaymentIntent);

export default router;