import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserByname, getUsersForSidebar } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/:username", protectRoute, getUserByname);

export default router;
