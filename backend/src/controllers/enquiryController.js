import Enquiry from "../models/Enquiry.js";
import CorporateQuote from "../models/CorporateQuote.js";
// CREATE ENQUIRY
export const createEnquiry = async (req, res) => {
    try {
        const {
            companyName,
            companyLocation,
            name,
            email,
            phone,
            subject,
            customMOQ,
            dimensions,
            ply,
            message,
        } = req.body;

        const enquiry = await Enquiry.create({
            companyName,
            companyLocation,
            name,
            email,
            phone,
            subject,

            customMOQ:
                customMOQ !== undefined &&
                customMOQ !== null &&
                customMOQ !== ""
                    ? Number(customMOQ)
                    : null,
            dimensions: dimensions || "",
            ply: ply || "",
            message,
        });

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully",
            enquiry,
        });

    } catch (error) {
        console.error(
            "Create enquiry error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// GET ALL ENQUIRIES
export const getEnquiries = async (req, res) => {
    try {
        const {
            search,
            status,
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
        const sortOrder =
            sort === "oldest"
                ? { createdAt: 1 }
                : { createdAt: -1 };

        // Active / inactive
        if (active === "true") {
            filter.isActive = true;
        }

        if (active === "false") {
            filter.isActive = false;
        }

        // New / read
        if (
            status === "new" ||
            status === "read"
        ) {
            filter.status = status;
        }

        // Search
        if (search && search.trim()) {
            const searchText = search.trim();

            filter.$or = [
                {
                    name: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    subject: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
            ];
        }

        // Total matching records
        const total = await Enquiry.countDocuments(
            filter
        );

        // Current page records
        const enquiries = await Enquiry.find(filter)
            .sort(sortOrder)
            .skip(skip)
            .limit(perPage);

        const totalPages = Math.ceil(
            total / perPage
        );

        res.status(200).json({
            success: true,
            count: enquiries.length,
            total,
            page: currentPage,
            limit: perPage,
            totalPages,
            enquiries,
        });

    } catch (error) {
        console.error(
            "Get enquiries error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET ALL ENQUIRIES + CORPORATE QUOTES
export const getAllEnquiries = async (req, res) => {
    try {
        const {
            search,
            status,
            active,
            page = 1,
            limit = 10,
            sort = "newest",
        } = req.query;

        const currentPage = Number(page);
        const perPage = Number(limit);

        /*
        |--------------------------------------------------------------------------
        | Build filters
        |--------------------------------------------------------------------------
        */

        const enquiryFilter = {};
        const corporateFilter = {};

        // Active / inactive
        if (active === "true") {
            enquiryFilter.isActive = true;
            corporateFilter.isActive = true;
        }

        if (active === "false") {
            enquiryFilter.isActive = false;
            corporateFilter.isActive = false;
        }

        // New / read
        if (status === "new" || status === "read") {
            enquiryFilter.status = status;
            corporateFilter.status = status;
        }

        // Search
        if (search && search.trim()) {
            const searchText = search.trim();

            enquiryFilter.$or = [
                {
                    name: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    subject: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    companyName: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    message: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
            ];

            corporateFilter.$or = [
                {
                    name: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    companyName: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
                {
                    requirements: {
                        $regex: searchText,
                        $options: "i",
                    },
                },
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Get Product Enquiries
        |--------------------------------------------------------------------------
        */

        const enquiries = await Enquiry.find(
            enquiryFilter
        ).lean();

        const formattedEnquiries = enquiries.map(
            (enquiry) => ({
                ...enquiry,

                // Identify source
                type: "enquiry",

                // Keep existing values
                subject: enquiry.subject || "Enquiry",
            })
        );

        /*
        |--------------------------------------------------------------------------
        | Get Corporate Quotes
        |--------------------------------------------------------------------------
        */

        const corporateQuotes =
            await CorporateQuote.find(
                corporateFilter
            ).lean();

        const formattedCorporateQuotes =
            corporateQuotes.map((quote) => ({
                ...quote,

                // Identify source
                type: "corporate",

                // Normalize Corporate Quote fields
                subject: "Corporate Quote",

                name: quote.name || "",
                email: quote.email || "",
                phone: quote.phone || "",

                companyName:
                    quote.companyName || "",

                companyLocation: "",

                customMOQ:
                    quote.quantity ?? null,

                dimensions:
                    quote.dimensions || "",

                ply:
                    quote.ply || "",

                message:
                    quote.requirements || "",
            }));

        /*
        |--------------------------------------------------------------------------
        | Combine both collections
        |--------------------------------------------------------------------------
        */

        let allEnquiries = [
            ...formattedEnquiries,
            ...formattedCorporateQuotes,
        ];

        /*
        |--------------------------------------------------------------------------
        | Sort
        |--------------------------------------------------------------------------
        */

        allEnquiries.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            return sort === "oldest"
                ? dateA - dateB
                : dateB - dateA;
        });

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        const total = allEnquiries.length;

        const totalPages =
            Math.ceil(total / perPage);

        const skip =
            (currentPage - 1) * perPage;

        const paginatedEnquiries =
            allEnquiries.slice(
                skip,
                skip + perPage
            );

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({
            success: true,
            count: paginatedEnquiries.length,
            total,
            page: currentPage,
            limit: perPage,
            totalPages,
            enquiries: paginatedEnquiries,
        });

    } catch (error) {
        console.error(
            "Get all enquiries error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// GET SINGLE ENQUIRY
export const getEnquiryById = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(
            req.params.id
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found",
            });
        }

        res.status(200).json({
            success: true,
            enquiry,
        });

    } catch (error) {
        console.error(
            "Get enquiry by ID error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// MARK ENQUIRY AS READ
export const markEnquiryAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const enquiry = await Enquiry.findByIdAndUpdate(
            id,
            {
                status: "read",
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Enquiry marked as read",
            enquiry,
        });

    } catch (error) {
        console.error(
            "Mark enquiry as read error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// SOFT DELETE ENQUIRY
export const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        const enquiry = await Enquiry.findByIdAndUpdate(
            id,
            {
                isActive: false,
            },
            {
                new: true,
            }
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Enquiry moved to inactive successfully",
            enquiry,
        });

    } catch (error) {
        console.error(
            "Delete enquiry error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// PERMANENT DELETE ENQUIRY
export const permanentlyDeleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        const enquiry = await Enquiry.findById(id);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found",
            });
        }

        // Only inactive enquiries can be permanently deleted
        if (enquiry.isActive) {
            return res.status(400).json({
                success: false,
                message:
                    "Active enquiry cannot be permanently deleted. Delete it first.",
            });
        }

        await Enquiry.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Enquiry permanently deleted",
        });

    } catch (error) {
        console.error(
            "Permanent delete enquiry error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};