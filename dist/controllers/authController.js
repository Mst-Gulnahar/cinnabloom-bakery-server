"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.login = exports.signup = exports.updateProfile = exports.getUserById = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "7d",
    });
};
// @desc    Get user by ID
// @route   GET /api/auth/user/:id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture || user.photoUrl || user.avatar || "",
                photoUrl: user.photoUrl || user.profilePicture || user.avatar || "",
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
exports.getUserById = getUserById;
// @desc    Update user profile
// @route   PUT /api/auth/update-profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, photoUrl, password } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (name)
            user.name = name;
        if (photoUrl !== undefined) {
            user.profilePicture = photoUrl;
            user.photoUrl = photoUrl;
            user.avatar = photoUrl;
        }
        if (password && password.trim() !== "") {
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(password, salt);
        }
        await user.save();
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                photoUrl: user.photoUrl,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
exports.updateProfile = updateProfile;
// @desc    Register a new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { name, email, password, profileImage } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
            profilePicture: profileImage || "",
            photoUrl: profileImage || "",
            avatar: profileImage || "",
        });
        const token = generateToken(user._id.toString());
        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
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
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture || user.photoUrl || user.avatar || "",
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
        let user = await User_1.default.findOne({ email: googleUserData.email });
        if (!user) {
            user = await User_1.default.create({
                name: googleUserData.name || "Google User",
                email: googleUserData.email,
                role: "user",
                profilePicture: googleUserData.profileImage || "",
                photoUrl: googleUserData.profileImage || "",
            });
        }
        const token = generateToken(user._id.toString());
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture || user.photoUrl || "",
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
exports.googleLogin = googleLogin;
//# sourceMappingURL=authController.js.map