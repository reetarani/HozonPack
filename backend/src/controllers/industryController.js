import Industry from "../models/Industry.js";
import Product from "../models/Product.js";
// create / post Industry 
export const createIndustry = async (req, res) => {
    try {

        const {
            name,
            subtitle,
            description
        } = req.body;


        const slug = name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");


        const existingIndustry = await Industry.findOne({
            slug
        });


        if (existingIndustry) {
            return res.status(400).json({
                success:false,
                message:"Industry already exists"
            });
        }


        // uploaded image path
        const image = req.file
            ? `/uploads/industries/${req.file.filename}`
            : "";


        const industry = await Industry.create({
            name,
            slug,
            subtitle,
            description,
            image
        });


        res.status(201).json({
            success:true,
            message:"Industry created successfully",
            industry
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};
// GET ALL INDUSTRIES
export const getIndustries = async (req, res) => {
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

        const industries = await Industry.find(filter)
            .sort({
                createdAt: -1,
            })
            .lean();

        const industriesWithCount = await Promise.all(
            industries.map(async (industry) => {
                const productCount =
                    await Product.countDocuments({
                        industries: industry._id,
                        isActive: true,
                    });

                return {
                    ...industry,
                    productCount,
                };
            })
        );

        res.status(200).json({
            success: true,
            count: industriesWithCount.length,
            industries: industriesWithCount,
        });

    } catch (error) {
        console.error(
            "Get industries error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// GET SINGLE INDUSTRY BY SLUG
export const getIndustryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const industry = await Industry.findOne({
            slug,
            isActive: true
        });

        if (!industry) {
            return res.status(404).json({
                success: false,
                message: "Industry not found"
            });
        }

        res.status(200).json({
            success: true,
            industry
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// GET SINGLE INDUSTRY BY ID
export const getIndustryById = async (req, res) => {
    try {
        const { id } = req.params;

        const industry = await Industry.findById(id);

        if (!industry) {
            return res.status(404).json({
                success: false,
                message: "Industry not found",
            });
        }

        res.status(200).json({
            success: true,
            industry,
        });

    } catch (error) {
        console.error("Get Industry By ID Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// UPDATE Industry
export const updateIndustry = async (req, res) => {
    try {
        const { id } = req.params;

        const industry = await Industry.findById(id);

        if (!industry) {
            return res.status(404).json({
                success: false,
                message: "Industry not found",
            });
        }

        // Update image if new image uploaded
        if (req.file) {
            industry.image = `/uploads/industries/${req.file.filename}`;
        }

        // Update name
        industry.name = req.body.name || industry.name;

        // Update slug
        if (req.body.slug) {
            const newSlug = req.body.slug
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-");

            // Check if another industry already uses this slug
            const existingIndustry = await Industry.findOne({
                slug: newSlug,
                _id: { $ne: id },
            });

            if (existingIndustry) {
                return res.status(400).json({
                    success: false,
                    message: "Industry slug already exists",
                });
            }

            industry.slug = newSlug;
        }

        // Update subtitle
        industry.subtitle =
            req.body.subtitle ?? industry.subtitle;

        // Update description
        industry.description =
            req.body.description ?? industry.description;

        // Update status
        industry.isActive =
            req.body.isActive ?? industry.isActive;

        await industry.save();

        res.status(200).json({
            success: true,
            message: "Industry updated successfully",
            industry,
        });

    } catch (error) {
        console.error("Update Industry Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// DELETE Industry
export const deleteIndustry = async (req, res) => {
    try {

        const { id } = req.params;

        const industry = await Industry.findByIdAndUpdate(
            id,
            {
                isActive: false
            },
            {
                new: true
            }
        );


        if (!industry) {
            return res.status(404).json({
                success: false,
                message: "Industry not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Industry deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// PERMANENT DELETE INDUSTRY
export const permanentlyDeleteIndustry = async (req, res) => {
    try {
        const { id } = req.params;

        const industry = await Industry.findById(id);

        if (!industry) {
            return res.status(404).json({
                success: false,
                message: "Industry not found",
            });
        }

        // Only inactive industries can be permanently deleted
        if (industry.isActive) {
            return res.status(400).json({
                success: false,
                message:
                    "Active industry cannot be permanently deleted. Deactivate it first.",
            });
        }

        await Industry.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Industry permanently deleted",
        });

    } catch (error) {
        console.error("Permanent delete industry error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Public API
export const getPublicIndustries = async (req, res) => {
    try {
        const industries = await Industry.find({
            isActive: true,
        }).sort({
            createdAt: 1,
        });

        res.status(200).json({
            success: true,
            count: industries.length,
            industries,
        });

    } catch (error) {
        console.error(
            "Get public industries error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};