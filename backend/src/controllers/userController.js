import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Create User
export const createUser = async (req, res) => {
    try {
        const {
            username,
            name,
            email,
            password,
            role,
            isActive
        } = req.body;

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const existingUsername = await User.findOne({
            username: username.toLowerCase(),
        });

        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists",
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

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
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

// Get All Users
export const getUsers = async (req, res) => {
    try {
        const { search, status } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const filter = {};

        // Search by name
        if (search && search.trim()) {
            const escapedSearch = search
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.name = {
                $regex: escapedSearch,
                $options: "i",
            };
        }

        // Status filter
        if (status === "active") {
            filter.isActive = true;
        }

        if (status === "inactive") {
            filter.isActive = false;
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            User.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
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

// Get Single User
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const {
            username,
            name,
            email,
            password,
            role,
            isActive,
        } = req.body;

        const existingUsername = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: id },
        });

        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists",
            });
        }

        const existingEmail = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: id },
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        user.username = username.toLowerCase();
        user.name = name;
        user.email = email.toLowerCase();
        user.role = role || "admin";
        user.isActive = isActive;

        // Only hash when a new password is provided
        if (
            password &&
            typeof password === "string" &&
            password.trim()
        ) {
            user.password = await bcrypt.hash(
                password.trim(),
                10
            );
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                updatedAt: user.updatedAt,
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

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Prevent deleting the only admin
        if (user.role === "admin") {
            const adminCount = await User.countDocuments({
                role: "admin",
            });

            if (adminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot delete the only admin user",
                });
            }
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};