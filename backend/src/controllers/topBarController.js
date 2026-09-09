import TopBar from "../models/TopBar.js";

// Get active top bar for customer website
export const getPublicTopBar = async (req, res) => {
    try {
        const topBar = await TopBar.findOne({
            isActive: true,
            endDate: { $gt: new Date() },
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            topBar,
        });
    } catch (error) {
        console.error("Get public top bar error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load top bar",
        });
    }
};

// Get all top bars for admin
export const getTopBars = async (req, res) => {
    try {
        const topBars = await TopBar.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            topBars,
        });
    } catch (error) {
        console.error("Get top bars error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load top bars",
        });
    }
};

// Get single top bar
export const getTopBar = async (req, res) => {
    try {
        const topBar = await TopBar.findById(req.params.id);

        if (!topBar) {
            return res.status(404).json({
                success: false,
                message: "Top bar not found",
            });
        }

        res.status(200).json({
            success: true,
            topBar,
        });
    } catch (error) {
        console.error("Get top bar error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load top bar",
        });
    }
};

// Create top bar
export const createTopBar = async (req, res) => {
    try {
        const {
            title,
            couponCode,
            endDate,
            linkText,
            linkUrl,
            isActive,
        } = req.body;

        // If new Top Bar is active,
        // deactivate all existing active Top Bars
        if (isActive === true || isActive === "true") {
            await TopBar.updateMany(
                { isActive: true },
                { $set: { isActive: false } }
            );
        }

        const topBar = await TopBar.create({
            title,
            couponCode,
            endDate,
            linkText,
            linkUrl,
            isActive:
                isActive === true ||
                isActive === "true",
        });

        res.status(201).json({
            success: true,
            message: "Top bar created successfully",
            topBar,
        });
    } catch (error) {
        console.error(
            "Create top bar error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create top bar",
        });
    }
};

// Update top bar
export const updateTopBar = async (req, res) => {
    try {
        const {
            title,
            couponCode,
            endDate,
            linkText,
            linkUrl,
            isActive,
        } = req.body;

        const active =
            isActive === true ||
            isActive === "true";

        // If this Top Bar is being activated,
        // deactivate all other active Top Bars
        if (active) {
            await TopBar.updateMany(
                {
                    isActive: true,
                    _id: {
                        $ne: req.params.id,
                    },
                },
                {
                    $set: {
                        isActive: false,
                    },
                }
            );
        }

        const topBar =
            await TopBar.findByIdAndUpdate(
                req.params.id,
                {
                    title,
                    couponCode,
                    endDate,
                    linkText,
                    linkUrl,
                    isActive: active,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!topBar) {
            return res.status(404).json({
                success: false,
                message: "Top bar not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Top bar updated successfully",
            topBar,
        });
    } catch (error) {
        console.error(
            "Update top bar error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update top bar",
        });
    }
};

// Delete top bar
export const deleteTopBar = async (req, res) => {
    try {
        const topBar = await TopBar.findByIdAndDelete(
            req.params.id
        );

        if (!topBar) {
            return res.status(404).json({
                success: false,
                message: "Top bar not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Top bar deleted successfully",
        });
    } catch (error) {
        console.error("Delete top bar error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete top bar",
        });
    }
};