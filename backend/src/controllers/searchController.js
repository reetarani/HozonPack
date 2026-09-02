import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Industry from "../models/Industry.js";
import SearchKeyword from "../models/SearchKeyword.js";


// ==========================================
// PUBLIC SEARCH
// ==========================================

export const publicSearch = async (req, res) => {
    try {
        const { q } = req.query;

        const keyword = q?.trim();

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required",
            });
        }

        const escapedKeyword = keyword.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(
            escapedKeyword,
            "i"
        );

        // Find matching categories and industries
        const [matchedCategories, matchedIndustries] =
            await Promise.all([
                Category.find({
                    isActive: true,
                    name: regex,
                }).select("_id"),

                Industry.find({
                    isActive: true,
                    name: regex,
                }).select("_id"),
            ]);

        const categoryIds = matchedCategories.map(
            (category) => category._id
        );

        const industryIds = matchedIndustries.map(
            (industry) => industry._id
        );

        // Save searched keyword
        await SearchKeyword.findOneAndUpdate(
            {
                keyword: keyword.toLowerCase(),
            },
            {
                $inc: {
                    count: 1,
                },
                $set: {
                    lastSearchedAt: new Date(),
                    isActive: true,
                },
            },
            {
                upsert: true,
                new: true,
            }
        );

        // Search products with pagination and limits to avoid returning huge result sets
        const page = Math.max(1, parseInt(req.query.page || "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "20", 10)));

        const productQuery = Product.find({
            isActive: true,

            $or: [
                // Product name
                {
                    name: regex,
                },

                // Product description
                {
                    description: regex,
                },

                // Category
                {
                    category: {
                        $in: categoryIds,
                    },
                },

                // Industries
                {
                    industries: {
                        $in: industryIds,
                    },
                },
            ],
        })
            .populate("category", "name")
            .populate("industries", "name")
            .sort({
                createdAt: -1,
            })
            .skip((page - 1) * limit)
            .limit(limit);

        const [products, totalCount] = await Promise.all([
            productQuery.exec(),
            Product.countDocuments({
                isActive: true,
                $or: [
                    { name: regex },
                    { description: regex },
                    { category: { $in: categoryIds } },
                    { industries: { $in: industryIds } },
                ],
            }),
        ]);

        return res.status(200).json({
            success: true,
            keyword,
            page,
            limit,
            count: products.length,
            total: totalCount,
            products,
        });

    } catch (error) {
        console.error(
            "Public search error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// SEARCH SUGGESTIONS
// ==========================================

export const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        const keyword = q?.trim();

        if (!keyword || keyword.length < 2) {
            return res.status(200).json({
                success: true,
                suggestions: [],
            });
        }

        const escapedKeyword = keyword.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(
            escapedKeyword,
            "i"
        );

        const [
            products,
            categories,
            industries,
            keywords,
        ] = await Promise.all([
            // Products
            Product.find({
                isActive: true,

                $or: [
                    {
                        name: regex,
                    },
                    {
                        description: regex,
                    },
                ],
            })
                .select("_id name")
                .limit(5),

            // Categories
            Category.find({
                isActive: true,
                name: regex,
            })
                .select("_id name slug")
                .limit(5),

            // Industries
            Industry.find({
                isActive: true,
                name: regex,
            })
                .select("_id name slug")
                .limit(5),

            // Previous keywords
            SearchKeyword.find({
                isActive: true,
                keyword: regex,
            })
                .sort({
                    count: -1,
                })
                .select("keyword count")
                .limit(5),
        ]);

        const suggestions = [
            ...products.map((item) => ({
                type: "product",
                text: item.name,
                id: item._id,
            })),

            ...categories.map((item) => ({
                type: "category",
                text: item.name,
                id: item._id,
                slug: item.slug,
            })),

            ...industries.map((item) => ({
                type: "industry",
                text: item.name,
                id: item._id,
                slug: item.slug,
            })),

            ...keywords.map((item) => ({
                type: "keyword",
                text: item.keyword,
                count: item.count,
            })),
        ];

        return res.status(200).json({
            success: true,
            suggestions,
        });

   } catch (error) {
    console.error(
        "Search suggestions error:",
        error
    );

    return res.status(500).json({
        success: false,
        message: error.message,
    });
}
};