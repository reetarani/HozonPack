import SeoMeta from "../models/SeoMeta.js";

// GET ALL SEO META
export const getSeoMeta = async (req, res) => {
    try {
        const {
            search,
            active,
            page = 1,
            limit = 10,
            sort = "newest",
        } = req.query;

        const currentPage = Number(page);
        const perPage = Number(limit);

        const skip =
            (currentPage - 1) * perPage;

        const filter = {};

        // Active / inactive
        if (active === "true") {
            filter.isActive = true;
        }

        if (active === "false") {
            filter.isActive = false;
        }

        // Search
        if (search && search.trim()) {
            const searchText = search.trim();

            filter.$or = [
                {
                    page: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    slug: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    metaTitle: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
            ];
        }

        // Sorting
        let sortOrder = {};

        if (sort === "oldest") {
            sortOrder = {
                createdAt: 1,
            };
        } else if (sort === "az") {
            sortOrder = {
                page: 1,
            };
        } else if (sort === "za") {
            sortOrder = {
                page: -1,
            };
        } else {
            sortOrder = {
                createdAt: -1,
            };
        }

        const total =
            await SeoMeta.countDocuments(filter);

        const seoMeta = await SeoMeta.find(filter)
            .sort(sortOrder)
            .skip(skip)
            .limit(perPage);

        const totalPages = Math.ceil(
            total / perPage
        );

        return res.status(200).json({
            success: true,
            count: seoMeta.length,
            total,
            page: currentPage,
            limit: perPage,
            totalPages,
            seoMeta,
        });

    } catch (error) {
        console.error(
            "Get SEO meta error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// GET SINGLE SEO META
export const getSeoMetaById = async (
    req,
    res
) => {
    try {
        const seoMeta =
            await SeoMeta.findById(
                req.params.id
            );

        if (!seoMeta) {
            return res.status(404).json({
                success: false,
                message: "SEO meta not found",
            });
        }

        return res.status(200).json({
            success: true,
            seoMeta,
        });

    } catch (error) {
        console.error(
            "Get SEO meta by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// CREATE SEO META
export const createSeoMeta = async (
    req,
    res
) => {
    try {
        const {
            page,
            slug,
            metaTitle,
            metaKeywords,
            metaDescription,
            isActive,
        } = req.body;

        if (!page || !slug) {
            return res.status(400).json({
                success: false,
                message:
                    "Page and slug are required",
            });
        }

        const existing =
            await SeoMeta.findOne({
                page: page.trim(),
            });

        if (existing) {
            return res.status(400).json({
                success: false,
                message:
                    "SEO meta already exists for this page",
            });
        }

        const seoMeta =
            await SeoMeta.create({
                page: page.trim(),
                slug: slug.trim(),
                metaTitle,
                metaKeywords,
                metaDescription,
                isActive:
                    isActive !== undefined
                        ? isActive
                        : true,
            });

        return res.status(201).json({
            success: true,
            message:
                "SEO meta created successfully",
            seoMeta,
        });

    } catch (error) {
        console.error(
            "Create SEO meta error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// UPDATE SEO META
export const updateSeoMeta = async (
    req,
    res
) => {
    try {
        const {
            page,
            slug,
            metaTitle,
            metaKeywords,
            metaDescription,
            isActive,
        } = req.body;

        const seoMeta =
            await SeoMeta.findById(
                req.params.id
            );

        if (!seoMeta) {
            return res.status(404).json({
                success: false,
                message: "SEO meta not found",
            });
        }

        seoMeta.page =
            page?.trim() || seoMeta.page;

        seoMeta.slug =
            slug?.trim() || seoMeta.slug;

        seoMeta.metaTitle =
            metaTitle ?? seoMeta.metaTitle;

        seoMeta.metaKeywords =
            metaKeywords ??
            seoMeta.metaKeywords;

        seoMeta.metaDescription =
            metaDescription ??
            seoMeta.metaDescription;

        if (isActive !== undefined) {
            seoMeta.isActive = isActive;
        }

        await seoMeta.save();

        return res.status(200).json({
            success: true,
            message:
                "SEO meta updated successfully",
            seoMeta,
        });

    } catch (error) {
        console.error(
            "Update SEO meta error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// DELETE / DEACTIVATE SEO META
export const deleteSeoMeta = async (
    req,
    res
) => {
    try {
        const seoMeta =
            await SeoMeta.findByIdAndUpdate(
                req.params.id,
                {
                    isActive: false,
                },
                {
                    new: true,
                }
            );

        if (!seoMeta) {
            return res.status(404).json({
                success: false,
                message: "SEO meta not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "SEO meta moved to inactive",
            seoMeta,
        });

    } catch (error) {
        console.error(
            "Delete SEO meta error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// PERMANENT DELETE
export const permanentlyDeleteSeoMeta =
    async (req, res) => {
        try {
            const seoMeta =
                await SeoMeta.findById(
                    req.params.id
                );

            if (!seoMeta) {
                return res.status(404).json({
                    success: false,
                    message:
                        "SEO meta not found",
                });
            }

            if (seoMeta.isActive) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Active SEO meta cannot be permanently deleted. Deactivate it first.",
                });
            }

            await SeoMeta.findByIdAndDelete(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message:
                    "SEO meta permanently deleted",
            });

        } catch (error) {
            console.error(
                "Permanent delete SEO meta error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // GET PUBLIC SEO META BY SLUG
export const getPublicSeoMeta = async (req, res) => {
    try {
        const { slug } = req.query;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required",
            });
        }

        const seoMeta = await SeoMeta.findOne({
            slug: slug.trim(),
            isActive: true,
        }).select(
            "page slug metaTitle metaKeywords metaDescription"
        );

        if (!seoMeta) {
            return res.status(404).json({
                success: false,
                message: "SEO meta not found",
            });
        }

        return res.status(200).json({
            success: true,
            seoMeta,
        });

    } catch (error) {
        console.error(
            "Get public SEO meta error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

