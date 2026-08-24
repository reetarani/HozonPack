import SearchKeyword from "../models/SearchKeyword.js";

// GET ALL SEARCH KEYWORDS
export const getSearchKeywords = async (req, res) => {
    try {
        const {
            search,
            active,
            page = 1,
            limit = 10,
            sort = "popular",
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

        // Search keyword
        if (search && search.trim()) {
            filter.keyword = {
                $regex: search.trim(),
                $options: "i",
            };
        }

        // Sorting
        let sortOrder = {};

        if (sort === "popular") {
            sortOrder = {
                count: -1,
            };
        } else if (sort === "newest") {
            sortOrder = {
                lastSearchedAt: -1,
            };
        } else if (sort === "oldest") {
            sortOrder = {
                lastSearchedAt: 1,
            };
        } else if (sort === "az") {
            sortOrder = {
                keyword: 1,
            };
        } else if (sort === "za") {
            sortOrder = {
                keyword: -1,
            };
        }

        const total =
            await SearchKeyword.countDocuments(
                filter
            );

        const keywords =
            await SearchKeyword.find(filter)
                .sort(sortOrder)
                .skip(skip)
                .limit(perPage);

        const totalPages = Math.ceil(
            total / perPage
        );

        return res.status(200).json({
            success: true,
            count: keywords.length,
            total,
            page: currentPage,
            limit: perPage,
            totalPages,
            keywords,
        });

    } catch (error) {
        console.error(
            "Get search keywords error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// GET SINGLE SEARCH KEYWORD
export const getSearchKeyword = async (
    req,
    res
) => {
    try {
        const keyword =
            await SearchKeyword.findById(
                req.params.id
            );

        if (!keyword) {
            return res.status(404).json({
                success: false,
                message:
                    "Search keyword not found",
            });
        }

        return res.status(200).json({
            success: true,
            keyword,
        });

    } catch (error) {
        console.error(
            "Get search keyword error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// SOFT DELETE
export const deleteSearchKeyword = async (
    req,
    res
) => {
    try {
        const keyword =
            await SearchKeyword.findByIdAndUpdate(
                req.params.id,
                {
                    isActive: false,
                },
                {
                    new: true,
                }
            );

        if (!keyword) {
            return res.status(404).json({
                success: false,
                message:
                    "Search keyword not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Search keyword moved to inactive",
            keyword,
        });

    } catch (error) {
        console.error(
            "Delete search keyword error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// PERMANENT DELETE
export const permanentlyDeleteSearchKeyword =
    async (req, res) => {
        try {
            const keyword =
                await SearchKeyword.findById(
                    req.params.id
                );

            if (!keyword) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Search keyword not found",
                });
            }

            if (keyword.isActive) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Active keyword cannot be permanently deleted. Deactivate it first.",
                });
            }

            await SearchKeyword.findByIdAndDelete(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message:
                    "Search keyword permanently deleted",
            });

        } catch (error) {
            console.error(
                "Permanent delete search keyword error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };