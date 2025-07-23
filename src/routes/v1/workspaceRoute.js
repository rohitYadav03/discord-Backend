import express from "express";
import isAuthenticated from "../../middleware/authMiddleware.js"
import validateSchema from "../../validators/zodValidator.js";
import { addChannelToWorkspaceSchema, addMemberToWorkspaceSchema, workspaceSchema } from "../../validators/workSpaceSchema.js";
import { addChannelToWorkspaceController, addMemberToWorkspaceController, createWorkspaceController, deleteWorkSpaceController, getWorkspaceByJoinCodeController, getWorkspaceUserIsPartController, updateWorkspaceController } from "../../controllers/workspaceController.js";



const router = express.Router();

router.post("/",isAuthenticated,validateSchema(workspaceSchema), createWorkspaceController);
router.get("/", isAuthenticated, getWorkspaceUserIsPartController);
router.delete("/:workspaceId", isAuthenticated, deleteWorkSpaceController);
router.get("/join/:joincode", isAuthenticated, getWorkspaceByJoinCodeController);
router.put("/:workspaceId", isAuthenticated, updateWorkspaceController);
router.put("/:workspaceId/members", isAuthenticated,validateSchema(addMemberToWorkspaceSchema), addMemberToWorkspaceController);
router.put("/:workspaceId/channels", isAuthenticated,validateSchema(addChannelToWorkspaceSchema),addChannelToWorkspaceController)



export default router;
