import express from "express";
import isAuthenticated from "../../middleware/authMiddleware";
import { isMemberPartofWorkspaceController } from "../../controllers/memberController";

const router = express.Router();

router.get("/workspace/:workspace", isAuthenticated,isMemberPartofWorkspaceController)


export default router;