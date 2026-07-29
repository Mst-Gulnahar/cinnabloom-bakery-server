import { Router } from "express";
import { 
  signup, 
  login, 
  googleLogin, 
  getUserById, 
  updateProfile 
} from "../controllers/authController";

const router = Router();

router.post("/google", googleLogin);
router.post("/signup", signup);
router.post("/login", login);

// Profile endpoints
router.get("/user/:id", getUserById);
router.put("/update-profile", updateProfile);

export default router;