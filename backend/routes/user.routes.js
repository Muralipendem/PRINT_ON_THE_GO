import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserByname, getUsersForSidebar, postOrder, getOrders, getShopsForMap, getUserById, updateOrderStatus } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar, getShopsForMap);
router.get("/:username", protectRoute, getUserByname);
router.get("/user/:id", protectRoute, getUserById);
router.post("/order", protectRoute, postOrder);
router.post("/getOrders", protectRoute, getOrders);
router.post("/Getshops", protectRoute, getShopsForMap);
router.put("/updateOrder", protectRoute, updateOrderStatus);

export default router;
