import express from "express";
import userRouter from "./users.js"
import workspaceRouter from "./workspaceRoute.js"
import channelRouter from "./channel.js"
import messageRouter from "./message.js"
const router = express.Router();

router.use("/users", userRouter)
router.use("/workspaces",workspaceRouter );
router.use("/channels", channelRouter)
router.use("/messages", messageRouter)

export default router