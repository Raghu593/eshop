import express from "express";
const router=express.Router();
import { createProduct, deleteProduct, getProducts,getProductsById ,updateProduct,createProductReview} from "../controllers/productController.js";
import {protect,admin} from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect,admin,createProduct)
router.route('/:id/reviews').post(protect,createProductReview)
router.route('/:id').get(getProductsById).delete(protect,admin,deleteProduct).put(protect,admin,updateProduct).post()

export default router