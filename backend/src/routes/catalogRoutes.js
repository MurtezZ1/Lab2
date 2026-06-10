import { Router } from "express";
import {
  addProductImageController,
  compareProductsController,
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

/**
 * @openapi
 * /api/products/compare:
 *   get:
 *     summary: Compare two or three products side by side
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *         description: Comma-separated product identifiers. Minimum 2, maximum 3.
 *     responses:
 *       200:
 *         description: Product comparison data
 *       400:
 *         description: Invalid comparison request
 *       404:
 *         description: One or more products were not found
 */
router.get("/products/compare", compareProductsController);
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
