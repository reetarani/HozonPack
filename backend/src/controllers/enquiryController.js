import Enquiry from "../models/Enquiry.js";

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
            message,
        } = req.body;

        const enquiry = await Enquiry.create({
            companyName,
            companyLocation,
            name,
            email,
            phone,
            subject,
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