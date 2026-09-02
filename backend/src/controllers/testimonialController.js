import fs from "fs";
import path from "path";

import Testimonial from "../models/Testimonial.js";


// ==========================================
// DELETE IMAGE FILE FROM SERVER
// ==========================================

const deleteImageFile = (imagePath) => {

    if (!imagePath) {
        return;
    }

    try {

        // Remove leading /
        const cleanPath =
            imagePath.replace(/^\/+/, "");

        const fullPath =
            path.join(
                process.cwd(),
                cleanPath
            );

        if (fs.existsSync(fullPath)) {

            fs.unlinkSync(fullPath);

            console.log(
                "Image deleted:",
                fullPath
            );
        }

    } catch (error) {

        console.error(
            "Error deleting image:",
            error
        );
    }
};


// ==========================================
// CREATE TESTIMONIAL
// ==========================================

export const createTestimonial = async (
    req,
    res
) => {

    try {

        const {
            name,
            designation,
            company,
            message,
            isActive,
        } = req.body;


        const image = req.file
            ? `/uploads/testimonials/${req.file.filename}`
            : "";


        const testimonial =
            await Testimonial.create({

                name,
                designation,
                company,
                message,
                image,

                isActive:
                    isActive === "true"
                        ? true
                        : false,
            });


        res.status(201).json({

            success: true,

            message:
                "Testimonial created successfully",

            testimonial,

        });

    } catch (error) {

        console.error(
            "Create testimonial error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message,

        });
    }
};


// ==========================================
// GET ALL TESTIMONIALS
// ==========================================

export const getTestimonials = async (
    req,
    res
) => {

    try {

        const {
            search,
            status,
        } = req.query;


        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;

        const skip =
            (page - 1) * limit;


        const filter = {};


        // Search

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

                $regex:
                    escapedSearch,

                $options:
                    "i",
            };
        }


        // Status

        if (status === "active") {

            filter.isActive = true;
        }


        if (status === "inactive") {

            filter.isActive = false;
        }


        const [
            testimonials,
            total,
        ] = await Promise.all([

            Testimonial.find(filter)
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(limit),

            Testimonial.countDocuments(
                filter
            ),

        ]);


        res.status(200).json({

            success: true,

            testimonials,

            pagination: {

                total,

                page,

                limit,

                totalPages:
                    Math.ceil(
                        total / limit
                    ),
            },

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};


// ==========================================
// GET SINGLE TESTIMONIAL
// ==========================================

export const getTestimonial = async (
    req,
    res
) => {

    try {

        const testimonial =
            await Testimonial.findById(
                req.params.id
            );


        if (!testimonial) {

            return res.status(404).json({

                success: false,

                message:
                    "Testimonial not found",

            });
        }


        res.status(200).json({

            success: true,

            data:
                testimonial,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};


// ==========================================
// UPDATE TESTIMONIAL
// ==========================================

export const updateTestimonial = async (
    req,
    res
) => {

    try {

        const {
            id,
        } = req.params;


        const testimonial =
            await Testimonial.findById(id);


        if (!testimonial) {

            return res.status(404).json({

                success: false,

                message:
                    "Testimonial not found",

            });
        }


        const {
            name,
            designation,
            company,
            message,
            isActive,
            removeImage,
        } = req.body;

console.log("========== TESTIMONIAL UPDATE ==========");
console.log("removeImage:", removeImage);
console.log("removeImage type:", typeof removeImage);
console.log("req.file:", req.file);
console.log("old image:", testimonial.image);
console.log("========================================");
        // ==================================
        // UPDATE BASIC INFORMATION
        // ==================================

        testimonial.name =
            name;

        testimonial.designation =
            designation || "";

        testimonial.company =
            company || "";

        testimonial.message =
            message;

        testimonial.isActive =
            isActive === "true";


        // ==================================
        // SAVE OLD IMAGE PATH
        // ==================================

        const oldImage =
            testimonial.image;


        // ==================================
        // CASE 1:
        // NEW IMAGE UPLOADED
        // ==================================

        if (req.file) {

            const newImage =
                `/uploads/testimonials/${req.file.filename}`;


            testimonial.image =
                newImage;


            // Delete old image

            if (oldImage) {

                deleteImageFile(
                    oldImage
                );
            }
        }


        // ==================================
        // CASE 2:
        // REMOVE IMAGE
        // ==================================

        else if (
            removeImage === "true"
        ) {

            // Remove image from MongoDB

            testimonial.image =
                "";


            // Remove physical image

            if (oldImage) {

                deleteImageFile(
                    oldImage
                );
            }
        }


        // ==================================
        // CASE 3:
        // NOTHING DONE
        // ==================================
        // Existing image remains unchanged.


        await testimonial.save();


        res.status(200).json({

            success: true,

            message:
                "Testimonial updated successfully",

            testimonial,

        });

    } catch (error) {

        console.error(
            "Update testimonial error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};


// ==========================================
// DELETE TESTIMONIAL
// ==========================================

export const deleteTestimonial = async (
    req,
    res
) => {

    try {

        const testimonial =
            await Testimonial.findById(
                req.params.id
            );


        if (!testimonial) {

            return res.status(404).json({

                success: false,

                message:
                    "Testimonial not found",

            });
        }


        // Delete image from server

        if (testimonial.image) {

            deleteImageFile(
                testimonial.image
            );
        }


        // Delete MongoDB document

        await Testimonial.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            success: true,

            message:
                "Testimonial permanently deleted",

        });

    } catch (error) {

        console.error(
            "Delete testimonial error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};


// ==========================================
// PUBLIC - ACTIVE TESTIMONIALS
// ==========================================

export const getPublicTestimonials = async (
    req,
    res
) => {

    try {

        const testimonials =
            await Testimonial.find({

                isActive: true,

            })
                .select(
                    "name designation company message image"
                )
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            testimonials,

        });

    } catch (error) {

        console.error(
            "Public testimonials error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch testimonials",

        });
    }
};