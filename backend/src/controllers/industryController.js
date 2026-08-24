import Industry from "../models/Industry.js";
// create / post Industry 
export const createIndustry = async (req, res) => {
    try {

        const {
            name,
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
            });

        res.status(200).json({
            success: true,
            count: industries.length,
            industries,
        });

    } catch (error) {
        console.error(error);

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
                message: "Industry not found"
            });
        }


        // update image if new image uploaded
        if (req.file) {
            industry.image = `/uploads/industries/${req.file.filename}`;
        }


        // update text fields
        industry.name = req.body.name || industry.name;
        industry.description = req.body.description || industry.description;
        industry.isActive = req.body.isActive ?? industry.isActive;


        await industry.save();


        res.status(200).json({
            success: true,
            message: "Industry updated successfully",
            industry
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
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