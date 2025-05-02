import { Router } from "express";
import { verifyAuthentication, verifyAuthorization } from "../../middlewares/auth.js";
import { createPaymentIntent, getPublishableKey } from "./stripeController.js";


const router = Router();

router.get('/key', getPublishableKey);
router.post('/createPaymentIntent', createPaymentIntent);

export default router;