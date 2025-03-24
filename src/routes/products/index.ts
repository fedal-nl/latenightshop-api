import { Router } from "express";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "./productController.js";
import { validateData } from "../../middlewares/validators.js";
import { createProductsSchema, updateProductsSchema } from  "../../db/schemas/product.js";
import { verifyAuthentication, verifyAuthorization } from "../..//middlewares/auth.js";

const router = Router()

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', verifyAuthentication, verifyAuthorization, validateData(createProductsSchema), createProduct);
router.patch('/:id', validateData(updateProductsSchema), updateProduct);
router.delete('/:id', deleteProduct)

export default router;