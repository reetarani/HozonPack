import CorporateQuote from "../models/CorporateQuote.js";

// Create Corporate Quote
export const createCorporateQuote = async (req, res) => {
    try {
        const {
            companyName,
            name,
            phone,
            email,
            quantity,
            dimensions,
            ply,
            requirements,
        } = req.body;

        // Required field validation
        if (!companyName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company name is required",
            });
        }

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        if (!phone?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required",
            });
        }

        if (!quantity) {
            return res.status(400).json({
                success: false,
                message: "Quantity is required",
            });
        }

        if (Number(quantity) < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        if (!ply?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Ply is required",
            });
        }

        const quote = await CorporateQuote.create({
            companyName: companyName.trim(),
            name: name.trim(),
            phone: phone.trim(),
            email: email?.trim() || "",
            quantity: Number(quantity),
            dimensions: dimensions?.trim() || "",
            ply: ply.trim(),
            requirements: requirements?.trim() || "",
        });

        return res.status(201).json({
            success: true,
            message: "Corporate quote submitted successfully",
            quote,
        });

    } catch (error) {
        console.error("Create corporate quote error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit corporate quote",
        });
    }
};


// Get all Corporate Quotes
export const getCorporateQuotes = async (req, res) => {
    try {
        const quotes = await CorporateQuote.find({
            isActive: true,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            quotes,
        });

    } catch (error) {
        console.error("Get corporate quotes error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load corporate quotes",
        });
    }
};


// Get single Corporate Quote
export const getCorporateQuote = async (req, res) => {
    try {
        const quote = await CorporateQuote.findById(
            req.params.id
        );

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: "Corporate quote not found",
            });
        }

        return res.status(200).json({
            success: true,
            quote,
        });

    } catch (error) {
        console.error("Get corporate quote error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load corporate quote",
        });
    }
};


// Mark Corporate Quote as Read
export const markCorporateQuoteAsRead = async (req, res) => {
    try {
        const quote =
            await CorporateQuote.findByIdAndUpdate(
                req.params.id,
                {
                    status: "read",
                },
                {
                    new: true,
                }
            );

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: "Corporate quote not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Corporate quote marked as read",
            quote,
        });

    } catch (error) {
        console.error(
            "Mark corporate quote as read error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update corporate quote",
        });
    }
};

// Soft Delete Corporate Quote
export const deleteCorporateQuote = async (req, res) => {
    try {
        const quote =
            await CorporateQuote.findByIdAndUpdate(
                req.params.id,
                {
                    isActive: false,
                },
                {
                    new: true,
                }
            );

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: "Corporate quote not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Corporate quote moved to inactive successfully",
            quote,
        });

    } catch (error) {
        console.error(
            "Delete corporate quote error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete corporate quote",
        });
    }
};


// Permanent Delete Corporate Quote
export const permanentlyDeleteCorporateQuote = async (
    req,
    res
) => {
    try {
        const quote =
            await CorporateQuote.findById(
                req.params.id
            );

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: "Corporate quote not found",
            });
        }

        // Only inactive quotes can be permanently deleted
        if (quote.isActive) {
            return res.status(400).json({
                success: false,
                message:
                    "Active corporate quote cannot be permanently deleted. Delete it first.",
            });
        }

        await CorporateQuote.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Corporate quote permanently deleted",
        });

    } catch (error) {
        console.error(
            "Permanent delete corporate quote error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to permanently delete corporate quote",
        });
    }
};