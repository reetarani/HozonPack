import Industry from "../models/Industry.js";
import Product from "../models/Product.js";


// =====================================================
// CREATE INDUSTRY
// =====================================================

export const createIndustry = async (req, res) => {
    try {

        const {
            name,
            subtitle,
            description,
            descriptionList,
        } = req.body;


        // ---------------------------------------------
        // Validate Name
        // ---------------------------------------------

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Industry name is required",
            });
        }


        // ---------------------------------------------
        // Create Slug
        // ---------------------------------------------

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");


        // ---------------------------------------------
        // Check Existing Industry
        // ---------------------------------------------

        const existingIndustry =
            await Industry.findOne({
                slug,
            });


        if (existingIndustry) {
            return res.status(400).json({
                success: false,
                message: "Industry already exists",
            });
        }


        // ---------------------------------------------
        // Parse Description List
        // ---------------------------------------------

        let parsedDescriptionList = [];


        if (descriptionList) {

            try {

                const parsed =
                    JSON.parse(descriptionList);


                if (Array.isArray(parsed)) {

                    parsedDescriptionList =
                        parsed
                            .map((item) => ({
                                label:
                                    item?.label
                                        ?.trim() || "",

                                value:
                                    item?.value
                                        ?.trim() || "",
                            }))
                            .filter(
                                (item) =>
                                    item.label ||
                                    item.value
                            );

                }

            } catch (error) {

                console.error(
                    "Description list parse error:",
                    error
                );

                parsedDescriptionList = [];
            }
        }


        // ---------------------------------------------
        // Uploaded Image
        // ---------------------------------------------

        const image = req.file
            ? `/uploads/industries/${req.file.filename}`
            : "";


        // ---------------------------------------------
        // Create Industry
        // ---------------------------------------------

        const industry =
            await Industry.create({

                name: name.trim(),

                slug,

                subtitle:
                    subtitle?.trim() || "",

                description:
                    description?.trim() || "",

                descriptionList:
                    parsedDescriptionList,

                image,

            });


        return res.status(201).json({

            success: true,

            message:
                "Industry created successfully",

            industry,

        });


    } catch (error) {

        console.error(
            "Create Industry Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }
};


// =====================================================
// GET ALL INDUSTRIES
// =====================================================

export const getIndustries = async (req, res) => {

    try {

        const {
            search,
            status,
        } = req.query;


        const filter = {};


        // ---------------------------------------------
        // Search
        // ---------------------------------------------

        if (
            search &&
            search.trim()
        ) {

            const escapedSearch =
                search
                    .trim()
                    .replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    );


            filter.name = {
                $regex: escapedSearch,
                $options: "i",
            };

        }


        // ---------------------------------------------
        // Status
        // ---------------------------------------------

        if (status === "active") {

            filter.isActive = true;

        }


        if (status === "inactive") {

            filter.isActive = false;

        }


        // ---------------------------------------------
        // Get Industries
        // ---------------------------------------------

        const industries =
            await Industry.find(filter)
                .sort({
                    createdAt: -1,
                })
                .lean();


        // ---------------------------------------------
        // Product Count
        // ---------------------------------------------

        const industriesWithCount =
            await Promise.all(

                industries.map(
                    async (industry) => {

                        const productCount =
                            await Product.countDocuments({

                                industries:
                                    industry._id,

                                isActive: true,

                            });


                        return {

                            ...industry,

                            productCount,

                        };

                    }
                )

            );


        return res.status(200).json({

            success: true,

            count:
                industriesWithCount.length,

            industries:
                industriesWithCount,

        });


    } catch (error) {

        console.error(
            "Get industries error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};


// =====================================================
// GET INDUSTRY BY SLUG
// =====================================================

export const getIndustryBySlug = async (
    req,
    res
) => {

    try {

        const {
            slug,
        } = req.params;


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


        return res.status(200).json({

            success: true,

            industry,

        });


    } catch (error) {

        console.error(
            "Get Industry By Slug Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};


// =====================================================
// GET INDUSTRY BY ID
// =====================================================

export const getIndustryById = async (
    req,
    res
) => {

    try {

        const {
            id,
        } = req.params;


        const industry =
            await Industry.findById(id);


        if (!industry) {

            return res.status(404).json({

                success: false,

                message:
                    "Industry not found",

            });

        }


        return res.status(200).json({

            success: true,

            industry,

        });


    } catch (error) {

        console.error(
            "Get Industry By ID Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};


// =====================================================
// UPDATE INDUSTRY
// =====================================================

export const updateIndustry = async (
    req,
    res
) => {

    try {

        const {
            id,
        } = req.params;


        const industry =
            await Industry.findById(id);


        if (!industry) {

            return res.status(404).json({

                success: false,

                message:
                    "Industry not found",

            });

        }


        // ---------------------------------------------
        // Image
        // ---------------------------------------------

        if (req.file) {

            industry.image =
                `/uploads/industries/${req.file.filename}`;

        }


        // ---------------------------------------------
        // Name
        // ---------------------------------------------

        if (
            req.body.name !== undefined
        ) {

            industry.name =
                req.body.name.trim();

        }


        // ---------------------------------------------
        // Slug
        // ---------------------------------------------

        if (
            req.body.slug !== undefined
        ) {

            const newSlug =
                req.body.slug
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-");


            const existingIndustry =
                await Industry.findOne({

                    slug: newSlug,

                    _id: {
                        $ne: id,
                    },

                });


            if (existingIndustry) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Industry slug already exists",

                });

            }


            industry.slug = newSlug;

        }


        // ---------------------------------------------
        // Subtitle
        // ---------------------------------------------

        industry.subtitle =
            req.body.subtitle ??
            industry.subtitle;


        // ---------------------------------------------
        // Description
        // ---------------------------------------------

        industry.description =
            req.body.description ??
            industry.description;


        // ---------------------------------------------
        // Description List
        // ---------------------------------------------

        if (
            req.body.descriptionList !==
            undefined
        ) {

            try {

                const parsed =
                    JSON.parse(
                        req.body.descriptionList
                    );


                if (
                    Array.isArray(parsed)
                ) {

                    industry.descriptionList =
                        parsed
                            .map((item) => ({

                                label:
                                    item?.label
                                        ?.trim() || "",

                                value:
                                    item?.value
                                        ?.trim() || "",

                            }))
                            .filter(
                                (item) =>
                                    item.label ||
                                    item.value
                            );

                } else {

                    industry.descriptionList =
                        [];

                }

            } catch (error) {

                console.error(
                    "Description list parse error:",
                    error
                );

                industry.descriptionList =
                    [];

            }

        }


        // ---------------------------------------------
        // Status
        // ---------------------------------------------

        if (
            req.body.isActive !==
            undefined
        ) {

            industry.isActive =
                req.body.isActive === true ||
                req.body.isActive === "true";

        }


        // ---------------------------------------------
        // Save
        // ---------------------------------------------

        await industry.save();


        return res.status(200).json({

            success: true,

            message:
                "Industry updated successfully",

            industry,

        });


    } catch (error) {

        console.error(
            "Update Industry Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};


// =====================================================
// DELETE / SOFT DELETE
// =====================================================

export const deleteIndustry = async (
    req,
    res
) => {

    try {

        const {
            id,
        } = req.params;


        const industry =
            await Industry.findByIdAndUpdate(

                id,

                {
                    isActive: false,
                },

                {
                    new: true,
                }

            );


        if (!industry) {

            return res.status(404).json({

                success: false,

                message:
                    "Industry not found",

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Industry deleted successfully",

        });


    } catch (error) {

        console.error(
            "Delete Industry Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};


// =====================================================
// PERMANENT DELETE
// =====================================================

export const permanentlyDeleteIndustry =
    async (
        req,
        res
    ) => {

        try {

            const {
                id,
            } = req.params;


            const industry =
                await Industry.findById(id);


            if (!industry) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Industry not found",

                });

            }


            if (industry.isActive) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Active industry cannot be permanently deleted. Deactivate it first.",

                });

            }


            await Industry.findByIdAndDelete(
                id
            );


            return res.status(200).json({

                success: true,

                message:
                    "Industry permanently deleted",

            });


        } catch (error) {

            console.error(
                "Permanent delete industry error:",
                error
            );

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    };


// =====================================================
// PUBLIC INDUSTRIES
// =====================================================

export const getPublicIndustries =
    async (
        req,
        res
    ) => {

        try {

            const industries =
                await Industry.find({

                    isActive: true,

                }).sort({

                    createdAt: 1,

                });


            return res.status(200).json({

                success: true,

                count:
                    industries.length,

                industries,

            });


        } catch (error) {

            console.error(
                "Get public industries error:",
                error
            );

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    };