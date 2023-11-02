
const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, CreateProductReview, getAllProductReviews, deleteReview } = require("../controllers/productController");
const { isAuthenticateUser, authorizeRoles  } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get( getAllProducts);

router.route("/admin/product/new").post(isAuthenticateUser, authorizeRoles("admin"),createProduct);
router
.route("/admin/product/:id")
.put(isAuthenticateUser, authorizeRoles("admin"), updateProduct)
.delete(isAuthenticateUser, authorizeRoles("admin"), deleteProduct)

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticateUser, CreateProductReview);

router.route("/reviews").get(getAllProductReviews).delete(isAuthenticateUser,deleteReview)


module.exports= router;
    