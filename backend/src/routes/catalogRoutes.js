import { Router } from "express";
import {
  addProductImageController,
  createProductController,
  deleteProductController,
  getProductController,
  listBrandsController,
  listCategoriesController,
  listProductsController,
  saveBrandController,
  saveCategoryController,
  updateInventoryController,
  updateProductController,
} from "../controllers/catalogController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateNamedEntity, validateProduct } from "../validators/catalogValidator.js";

const router = Router();
const adminOnly = [authenticate, authorizeRoles("Admin", "Manager")];

router.get("/products", listProductsController);
router.get("/products/:id", getProductController);
router.post("/products", ...adminOnly, validateRequest(validateProduct), createProductController);
router.put("/products/:id", ...adminOnly, updateProductController);
router.delete("/products/:id", ...adminOnly, deleteProductController);
router.post("/products/:id/images", ...adminOnly, addProductImageController);
router.put("/products/:id/inventory", ...adminOnly, updateInventoryController);

router.get("/categories", listCategoriesController);
router.post("/categories", ...adminOnly, validateRequest(validateNamedEntity), saveCategoryController);

router.get("/brands", listBrandsController);
router.post("/brands", ...adminOnly, validateRequest(validateNamedEntity), saveBrandController);

export default router;
