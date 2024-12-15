import express from "express";
import { getMessages, sendMessage, sendFile, updateMessageToViewed } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage, sendFile);
router.post("/:id", protectRoute, updateMessageToViewed);


export default router;
