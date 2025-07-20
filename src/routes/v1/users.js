import express from "express";
import {signIn, signUp}  from "../../controllers/userController.js"
import {userSignInSchema, userSignUpSchema} from "../../validators/userSchema.js";
import validateSchema from "../../validators/zodValidator.js";
import isAuthenticated from "../../middleware/authMiddleware.js";
const router = express.Router();


router.post("/signup",validateSchema(userSignUpSchema), signUp)
router.post("/signin",validateSchema(userSignInSchema), signIn)

router.get('/protected', isAuthenticated, (req, res) => {
  return res.json({
    message: 'Access granted ✅',
    userId: req.user  // This comes from middleware (req.user = user.id)
  });
});


export default router;
