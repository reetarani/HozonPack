import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

// Register User
export const registerUser = async (req, res) => {
    try {
        const {
            username,
            name,
            email,
            password,
            role,
            isActive,
        } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() },
            ],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            username: username.toLowerCase(),
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "admin",
            isActive:
                isActive !== undefined
                    ? isActive
                    : true,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Login User
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Username and password are required",
            });
        }

        const user = await User.findOne({
            username: username.toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid username or password",
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account is inactive",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid username or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        // Don't reveal whether email exists
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If the email exists, a password reset link has been sent.",
            });
        }

        // Generate RAW reset token
        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        // Store ONLY the hashed token in MongoDB
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;

        // Token expires in 15 minutes
        user.resetPasswordExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        // RAW token goes into the email link
        const resetLink =
            `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

        return res.status(200).json({
            success: true,
            message:
                "If the email exists, a password reset link has been sent.",
            resetLink,
            name: user.name,
            email: user.email,
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to process password reset request",
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Reset token is missing",
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        // Hash the RAW token received from the URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user using hashed token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "Reset link is invalid or does not match",
            });
        }

        // Check token expiry
        if (
            !user.resetPasswordExpires ||
            new Date(user.resetPasswordExpires) <= new Date()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Reset link has expired",
            });
        }

        // Update password
        user.password = await bcrypt.hash(
            password,
            10
        );

        // Invalidate reset token
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Password reset successfully",
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};