import express from "express";
import signUp  from "../../controllers/userController.js"
import userSignUpSchema from "../../validators/userSchema.js";
import validateSchema from "../../validators/zodValidator.js";
const router = express.Router();


router.post("/signup",validateSchema(userSignUpSchema), signUp)

export default router