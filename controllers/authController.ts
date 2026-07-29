import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: { id: string };
}

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "7d",
  });
};

const findUserByIdentifier = async (id: string) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await User.findById(id);
  }
  return await User.findOne({ email: id.toLowerCase() });
};

// @desc    Get user by ID
// @route   GET /api/auth/user/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await findUserByIdentifier(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const image = user.profilePicture || user.photoUrl || user.avatar || "";

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: image,
        photoUrl: image,
        avatar: image,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, name, photoUrl, password } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Auth Middleware Check Guard (optional enhancement if req.user is attached)
    if (req.user && req.user.id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized profile update request" });
    }

    const user = await findUserByIdentifier(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name && name.trim() !== "") {
      user.name = name.trim();
    }

    if (photoUrl !== undefined) {
      const cleanPhoto = photoUrl.trim();
      user.profilePicture = cleanPhoto;
      user.photoUrl = cleanPhoto;
      user.avatar = cleanPhoto;
    }

    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password.trim(), salt);
    }

    await user.save();

    const updatedImage = user.profilePicture || user.photoUrl || user.avatar || "";

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: updatedImage,
        photoUrl: updatedImage,
        avatar: updatedImage,
      },
    });
  } catch (error: any) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// @desc    Register a new user
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
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
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        photoUrl: user.photoUrl,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// @desc    Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());
    const image = user.profilePicture || user.photoUrl || user.avatar || "";

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: image,
        photoUrl: image,
        avatar: image,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// @desc    Google OAuth login/signup
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { user: googleUserData } = req.body;

    if (!googleUserData || !googleUserData.email) {
      return res.status(400).json({ success: false, message: "Invalid Google user data" });
    }

    const normalizedEmail = googleUserData.email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: googleUserData.name || "Google User",
        email: normalizedEmail,
        role: "user",
        profilePicture: googleUserData.profileImage || "",
        photoUrl: googleUserData.profileImage || "",
        avatar: googleUserData.profileImage || "",
      });
    }

    const token = generateToken(user._id.toString());
    const image = user.profilePicture || user.photoUrl || user.avatar || "";

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: image,
        photoUrl: image,
        avatar: image,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};