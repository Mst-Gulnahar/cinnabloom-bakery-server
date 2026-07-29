"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Generate JWT Token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "7d",
    });
};
// @desc    Register a new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = generateToken(user._id.toString());
        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
exports.signup = signup;
// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please enter email and password" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(user._id.toString());
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
exports.login = login;
// @desc    Google OAuth login/signup
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
    try {
        const { user: googleUserData } = req.body;
        if (!googleUserData || !googleUserData.email) {
            return res.status(400).json({ success: false, message: "Invalid Google user data" });
        }
        // Check if user already exists
        let user = await User_1.default.findOne({ email: googleUserData.email });
        // If user does not exist, create a new record
        if (!user) {
            user = await User_1.default.create({
                name: googleUserData.name || "Google User",
                email: googleUserData.email,
                role: "user",
            });
        }
        const token = generateToken(user._id.toString());
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
exports.googleLogin = googleLogin;
//# sourceMappingURL=authController.js.map