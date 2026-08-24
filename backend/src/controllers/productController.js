
import Product from "../models/Product.js";
// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const image = req.file
            ? `/uploads/products/${req.file.filename}`
            : "";

        let industries = [];

        if (req.body.industries) {
            industries = JSON.parse(req.body.industries);
        }

        const product = await Product.create({
            ...req.body,
            industries,
            image,
            isActive: req.body.isActive === "true",
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });

    } catch (error) {
        console.error(error);

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

// GET ALL PRODUCTS
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

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        if (category) {
            filter.category = category;
        }

        if (industry) {
            filter.industries = industry;
        }

        if (status === "active") {
            filter.isActive = true;
        }

        if (status === "inactive") {
            filter.isActive = false;
        }

        const currentPage = Number(page);
        const itemsPerPage = Number(limit);

        const skip = (currentPage - 1) * itemsPerPage;

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .populate("category", "name slug")
            .populate("industries", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(itemsPerPage);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: currentPage,
            limit: itemsPerPage,
            totalPages: Math.ceil(total / itemsPerPage),
            data: products,
        });

    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// GET PRODUCT BY ID
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        .populate("category", "name slug")
        .populate("industries", "name slug");

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

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// GET PRODUCT BY SLUG
export const getProductBySlug = async (req, res) => {
    try {

        const product = await Product.findOne({
            slug: req.params.slug,
            isActive: true
        })
        .populate("category", "name slug")
        .populate("industries", "name slug");

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

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let industries = product.industries;

        if (req.body.industries) {
            industries = JSON.parse(req.body.industries);
        }

        const updateData = {
            ...req.body,
            industries,
            isActive: req.body.isActive === "true",
        };

        // Only replace image when a new image is uploaded
        if (req.file) {
            updateData.image =
                `/uploads/products/${req.file.filename}`;
        }

        delete updateData.imageFile;

        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });

    } catch (error) {
        console.error(error);

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

// DELETE PRODUCT (SOFT DELETE)
export const deleteProduct = async (req,res)=>{
    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                isActive:false
            },
            {
                new:true
            }
        );

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"Product deleted successfully"
        });

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};
// PERMANENT DELETE PRODUCT
export const permanentlyDeleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product permanently deleted",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Public - Get Active Products
export const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isActive: true,
        })
            .populate("category", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {
        console.error("Public products error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch products",
        });
    }
};