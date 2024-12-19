import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserByname, getUsersForSidebar, postOrder, getOrders } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/:username", protectRoute, getUserByname);
router.post("/order", protectRoute, postOrder);
router.get("/orders", protectRoute, getOrders);

export default router;
