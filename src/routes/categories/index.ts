import { Router } from "express";
import { verifyAuthentication, verifyAuthorization } from "../../middlewares/auth.js";
import { validateData } from "../..//middlewares/validators.js";
import { createCategoriesSchema, updateCategoriesSchema } from "../../db/schemas/category.js";
import { createCategory, getCategoryById, listCategories, updateCategory, deleteCategory } from "./categoryController.js";


const router = Router();
router.post('/', verifyAuthentication, verifyAuthorization, validateData(createCategoriesSchema), createCategory);
router.get('/', listCategories);
router.get('/:id', getCategoryById);
router.put('/:id',  verifyAuthentication, verifyAuthorization, validateData(updateCategoriesSchema), updateCategory)
router.delete('/:id', verifyAuthentication, verifyAuthorization, deleteCategory )

export default router;