import { Router } from "express";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "./productController";
import { validateData } from "../../middlewares/validators";
import { createProductsSchema, updateProductsSchema } from  "../../db/schemas/product";

const router = Router()

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', validateData(createProductsSchema), createProduct);
router.patch('/:id', validateData(updateProductsSchema), updateProduct);
router.delete('/:id', deleteProduct)

export default router;