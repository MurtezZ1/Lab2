import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addProductImage,
  createCatalogProduct,
  getBrands,
  getCategories,
  getProduct,
  getProducts,
  removeCatalogProduct,
  saveBrand,
  saveCategory,
  saveInventory,
  updateCatalogProduct,
} from "../services/catalogService.js";

export const listProductsController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getProducts(req.query) });
});

export const getProductController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getProduct(req.params.id) });
});

export const createProductController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await createCatalogProduct(req.body, req.user.id) });
});

export const updateProductController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await updateCatalogProduct(req.params.id, req.body, req.user.id) });
});

export const deleteProductController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await removeCatalogProduct(req.params.id, req.user.id) });
});

export const listCategoriesController = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await getCategories() });
});

export const saveCategoryController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await saveCategory(req.body, req.user.id) });
});

export const listBrandsController = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await getBrands() });
});

export const saveBrandController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await saveBrand(req.body, req.user.id) });
});

export const addProductImageController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await addProductImage(req.params.id, req.body, req.user.id) });
});

export const updateInventoryController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await saveInventory(req.params.id, req.body, req.user.id) });
});
