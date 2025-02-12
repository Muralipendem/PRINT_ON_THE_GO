import express from "express";
import { getMessages, sendMessage, sendFile, updateMessageToViewed, deleteChat } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/deleteChat", protectRoute, deleteChat);
router.post("/send/:id", protectRoute, sendMessage, sendFile);
router.post("/update/:id", protectRoute, updateMessageToViewed);


export default router;
