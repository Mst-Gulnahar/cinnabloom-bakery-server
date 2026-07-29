"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/google", authController_1.googleLogin);
router.post("/signup", authController_1.signup);
router.post("/login", authController_1.login);
// Profile endpoints
router.get("/user/:id", authController_1.getUserById);
router.put("/update-profile", authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map