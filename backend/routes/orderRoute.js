
const express = require("express");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router = express.Router();

router.route("/order/new").post(isAuthenticateUser, newOrder);

router.route("/order/:id").get(isAuthenticateUser, authorizeRoles("admin"), getSingleOrder);

router.route("/order/me").post(isAuthenticateUser, myOrders);

router.route("/admin/orders").get(isAuthenticateUser, authorizeRoles("admin"), getAllOrders);

router.route("/admin/orders/:id").put(isAuthenticateUser, authorizeRoles("admin"), updateOrder)
.delete(isAuthenticateUser, authorizeRoles("admin"), deleteOrder );







module.exports = router;