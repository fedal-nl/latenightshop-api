import { Router } from "express";
import { verifyAuthentication, verifyAuthorization } from "../../middlewares/auth.js";
import { validateData } from "../..//middlewares/validators.js";
import { createOrderWithItemSchema, updateOrderSchema } from "../../db/schemas/orders.js";
import { createOrder, getOrderById, listOrders, updateOrder } from "./orderController.js";

const router = Router();

router.post('/', verifyAuthentication, verifyAuthorization, validateData(createOrderWithItemSchema), createOrder);
router.get('/', verifyAuthentication, verifyAuthorization, listOrders);
router.get('/:id', verifyAuthentication, verifyAuthorization, getOrderById);
router.put('/:id',  verifyAuthentication, verifyAuthorization, validateData(updateOrderSchema), updateOrder)

export default router;