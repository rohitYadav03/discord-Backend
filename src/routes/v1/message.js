import express from "express";
import isAuthenticated from "../../middleware/authMiddleware.js"
import { getMessageController } from "../../controllers/messageController.js";
const router = express.Router();

router.get("/:channelId",isAuthenticated, getMessageController)

export default router;