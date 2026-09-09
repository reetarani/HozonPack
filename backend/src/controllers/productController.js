import Product from "../models/Product.js";
import Industry from "../models/Industry.js";

// ============================================================
// CREATE PRODUCT
// ============================================================

export const createProduct = async (req, res) => {
    try {
        // --------------------------------------------------------
        // Main image
        // --------------------------------------------------------

        const image = req.files?.image?.[0]
            ? `/uploads/products/${req.files.image[0].filename}`
            : "";

        // --------------------------------------------------------
        // Gallery images
        // --------------------------------------------------------

        const gallery = req.files?.galleryImages
            ? req.files.galleryImages.map(
                  (file) =>
                      `/uploads/products/${file.filename}`
              )
            : [];

        // --------------------------------------------------------
        // Industries
        // --------------------------------------------------------

        let industries = [];

        if (req.body.industries) {
            industries = JSON.parse(
                req.body.industries
            );
        }

        // --------------------------------------------------------
        // Highlights
        // --------------------------------------------------------

        let highlights = [];

        if (req.body.highlights) {
            highlights = JSON.parse(
                req.body.highlights
            );
        }

        // --------------------------------------------------------
        // Fast Delivery
        // --------------------------------------------------------

        const fastDelivery =
            req.body.fastDelivery === "true";

        // --------------------------------------------------------
        // Create Product
        // --------------------------------------------------------

        const product = await Product.create({
            ...req.body,
            moq: req.body.moq
                ? Number(req.body.moq)
                : null,
            moqUnit: req.body.moqUnit || "pcs",
            fastDelivery,
            industries,
            highlights,
            image,
            gallery,

            isActive:
                req.body.isActive === "true",
        });

        // --------------------------------------------------------
        // Response
        // --------------------------------------------------------

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error(
            "Create product error:",
            error
        );

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// ============================================================
// GET ALL PRODUCTS - ADMIN
// ============================================================

export const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            industry,
            status,
            page = 1,
            limit = 10,
        } = req.query;

        const filter = {};

        // --------------------------------------------------------
        // Search
        // --------------------------------------------------------

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        // --------------------------------------------------------
        // Category
        // --------------------------------------------------------

        if (category) {
            filter.category = category;
        }

        // --------------------------------------------------------
        // Industry
        // --------------------------------------------------------

        if (industry) {
            filter.industries = industry;
        }

        // --------------------------------------------------------
        // Status
        // --------------------------------------------------------

        if (status === "active") {
            filter.isActive = true;
        }

        if (status === "inactive") {
            filter.isActive = false;
        }

        // --------------------------------------------------------
        // Pagination
        // --------------------------------------------------------

        const currentPage = Number(page);
        const itemsPerPage = Number(limit);

        const skip =
            (currentPage - 1) * itemsPerPage;

        // --------------------------------------------------------
        // Total
        // --------------------------------------------------------

        const total =
            await Product.countDocuments(filter);

        // --------------------------------------------------------
        // Products
        // --------------------------------------------------------

        const products =
            await Product.find(filter)
                .populate(
                    "category",
                    "name slug"
                )
                .populate(
                    "industries",
                    "name slug"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(itemsPerPage);

        // --------------------------------------------------------
        // Response
        // --------------------------------------------------------

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: currentPage,
            limit: itemsPerPage,
            totalPages: Math.ceil(
                total / itemsPerPage
            ),
            data: products,
        });
    } catch (error) {
        console.error(
            "Get products error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================================
// GET PRODUCT BY ID
// ============================================================

export const getProduct = async (req, res) => {
    try {
        const product =
            await Product.findById(req.params.id)
                .populate(
                    "category",
                    "name slug"
                )
                .populate(
                    "industries",
                    "name slug"
                );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(
            "Get product error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================================
// GET PRODUCT BY SLUG
// ============================================================

export const getProductBySlug = async (
    req,
    res
) => {
    try {
        const product =
            await Product.findOne({
                slug: req.params.slug,
                isActive: true,
            })
                .populate(
                    "category",
                    "name slug"
                )
                .populate(
                    "industries",
                    "name slug"
                );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(
            "Get product by slug error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================================
// UPDATE PRODUCT
// ============================================================

export const updateProduct = async (
    req,
    res
) => {
    try {
        // --------------------------------------------------------
        // Find product
        // --------------------------------------------------------

        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // --------------------------------------------------------
        // Industries
        // --------------------------------------------------------

        let industries =
            product.industries;

        if (req.body.industries) {
            industries = JSON.parse(
                req.body.industries
            );
        }

        // --------------------------------------------------------
        // Highlights
        // --------------------------------------------------------

        let highlights =
            product.highlights || [];

        if (req.body.highlights) {
            highlights = JSON.parse(
                req.body.highlights
            );
        }

        // --------------------------------------------------------
        // Gallery
        // --------------------------------------------------------

        let gallery =
            product.gallery || [];

        // Existing gallery images retained
        // by admin

        if (req.body.gallery) {
            gallery = JSON.parse(
                req.body.gallery
            );
        }

        // Add newly uploaded gallery images

        if (req.files?.galleryImages) {
            const newGalleryImages =
                req.files.galleryImages.map(
                    (file) =>
                        `/uploads/products/${file.filename}`
                );

            gallery = [
                ...gallery,
                ...newGalleryImages,
            ];
        }

        // --------------------------------------------------------
        // Fast Delivery
        // --------------------------------------------------------

        const fastDelivery =
            req.body.fastDelivery === "true";

        // --------------------------------------------------------
        // Update Data
        // --------------------------------------------------------

        const updateData = {
            ...req.body,

            moq: req.body.moq
                ? Number(req.body.moq)
                : null,
            moqUnit: req.body.moqUnit || "pcs",
            fastDelivery,

            industries,
            highlights,
            gallery,

            isActive:
                req.body.isActive === "true",
        };

        // --------------------------------------------------------
        // Main Image
        // --------------------------------------------------------

        // Only replace main image
        // when a new image is uploaded

        if (req.files?.image?.[0]) {
            updateData.image =
                `/uploads/products/${req.files.image[0].filename}`;
        }

        // Remove helper field if present

        delete updateData.imageFile;

        // --------------------------------------------------------
        // Update Product
        // --------------------------------------------------------

        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        // --------------------------------------------------------
        // Response
        // --------------------------------------------------------

        res.status(200).json({
            success: true,
            message:
                "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error(
            "Update product error:",
            error
        );

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// ============================================================
// DELETE PRODUCT - SOFT DELETE
// ============================================================

export const deleteProduct = async (
    req,
    res
) => {
    try {
        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                {
                    isActive: false,
                },
                {
                    new: true,
                }
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Product deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete product error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================================
// PERMANENT DELETE PRODUCT
// ============================================================

export const permanentlyDeleteProduct =
    async (req, res) => {
        try {
            const product =
                await Product.findByIdAndDelete(
                    req.params.id
                );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Product not found",
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Product permanently deleted",
            });
        } catch (error) {
            console.error(
                "Permanent delete product error:",
                error
            );

            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// ============================================================
// PUBLIC - GET ACTIVE PRODUCTS
// ============================================================

export const getPublicProducts = async (
    req,
    res
) => {
    try {
        const products =
            await Product.find({
                isActive: true,
            })
                .populate(
                    "category",
                    "name slug"
                )
                .populate(
                    "industries",
                    "name slug"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error(
            "Public products error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch products",
        });
    }
};

// ============================================================
// PUBLIC - GET PRODUCTS BY INDUSTRY
// ============================================================

export const getPublicProductsByIndustry =
    async (req, res) => {
        try {
            const { slug } = req.params;

            // ----------------------------------------------------
            // Find industry
            // ----------------------------------------------------

            const industry =
                await Industry.findOne({
                    slug,
                    isActive: true,
                });

            if (!industry) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Industry not found",
                });
            }

            // ----------------------------------------------------
            // Find products
            // ----------------------------------------------------

            const products =
                await Product.find({
                    industries: industry._id,
                    isActive: true,
                })
                    .populate(
                        "category",
                        "name slug"
                    )
                    .populate(
                        "industries",
                        "name slug"
                    )
                    .sort({
                        createdAt: -1,
                    });

            // ----------------------------------------------------
            // Response
            // ----------------------------------------------------

            return res.status(200).json({
                success: true,
                count: products.length,
                products,
            });
        } catch (error) {
            console.error(
                "Get public products by industry error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };