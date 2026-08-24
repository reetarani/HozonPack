import Category from "../models/Category.js";
// create / post categories
export const createCategory = async (req, res) => {
    try {
        const {
            name,
            description,
            image,
            isActive
        } = req.body;

        const slug = name
            .toLowerCase()
            .replace(/\s+/g, "-");

        const category = await Category.create({
            name,
            slug,
            description,
            image,
            isActive
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
    try {
        const { search, status } = req.query;

        const filter = {};

        if (search && search.trim()) {
            const escapedSearch = search
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.name = {
                $regex: escapedSearch,
                $options: "i",
            };
        }

        if (status === "active") {
            filter.isActive = true;
        }

        if (status === "inactive") {
            filter.isActive = false;
        }

        const categories = await Category.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// GET SINGLE CATEGORY BY SLUG
export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await Category.findOne({
            slug,
            isActive: true
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// GET SINGLE CATEGORY BY ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            category,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }};
// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
    try {

        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                isActive: false,
            },
            {
                new: true,
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category moved to inactive successfully",
            category,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// PERMANENT DELETE CATEGORY
export const permanentlyDeleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (category.isActive) {
            return res.status(400).json({
                success: false,
                message:
                    "Active category cannot be permanently deleted. Deactivate it first.",
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category permanently deleted",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Public - Get Active Categories
export const getPublicCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            isActive: true,
        })
            .select("_id name slug")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            categories,
        });

    } catch (error) {
        console.error(
            "Public categories error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch categories",
        });
    }
};