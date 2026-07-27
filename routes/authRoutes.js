import { Router } from "express";
import { signup, login, googleLogin } from "../controllers/authController";
const router = Router();
router.post("/google", googleLogin);
router.post("/signup", signup);
router.post("/login", login);
export default router;
//# sourceMappingURL=authRoutes.js.map