import Client from "../models/Client.js";
import fs from "fs";
import path from "path";


// =====================================================
// CREATE CLIENT
// =====================================================

export const createClient = async (req, res) => {

    try {

        const {
            name,
            isActive
        } = req.body;


        // Validate name
        if (
            !name ||
            !name.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Client name is required",
            });
        }


        // Check duplicate
        const existingClient =
            await Client.findOne({
                name: name.trim(),
            });


        if (existingClient) {

            return res.status(400).json({
                success: false,
                message:
                    "Client already exists",
            });
        }


        // Logo
        const logo = req.file
            ? `/uploads/clients/${req.file.filename}`
            : "";


        const client =
            await Client.create({

                name:
                    name.trim(),

                logo,

                isActive:
                    isActive !== undefined
                        ? (
                            isActive === "true" ||
                            isActive === true
                        )
                        : true,
            });


        return res.status(201).json({

            success: true,

            message:
                "Client created successfully",

            client,

        });

    } catch (error) {

        console.error(
            "Create client error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};



// =====================================================
// GET ALL CLIENTS
// =====================================================

export const getClients = async (req, res) => {

    try {

        const {
            search,
            status
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
        if (
            status === "active"
        ) {

            filter.isActive = true;
        }


        if (
            status === "inactive"
        ) {

            filter.isActive = false;
        }


        const [
            clients,
            total
        ] = await Promise.all([

            Client.find(filter)
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit),

            Client.countDocuments(
                filter
            ),

        ]);


        return res.status(200).json({

            success: true,

            clients,

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

        console.error(
            "Get clients error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};



// =====================================================
// GET SINGLE CLIENT
// =====================================================

export const getClient = async (req, res) => {

    try {

        const client =
            await Client.findById(
                req.params.id
            );


        if (!client) {

            return res.status(404).json({

                success: false,

                message:
                    "Client not found",

            });
        }


        return res.status(200).json({

            success: true,

            data: client,

        });

    } catch (error) {

        console.error(
            "Get client error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};



// =====================================================
// DELETE PHYSICAL LOGO FILE
// =====================================================

const deleteLogoFile = (logoPath) => {

    try {

        if (!logoPath) {
            return;
        }


        const filePath =
            path.join(
                process.cwd(),
                logoPath
            );


        if (
            fs.existsSync(
                filePath
            )
        ) {

            fs.unlinkSync(
                filePath
            );

            console.log(
                "Deleted logo file:",
                filePath
            );
        }

    } catch (error) {

        console.error(
            "Failed to delete logo file:",
            error
        );
    }
};



// =====================================================
// UPDATE CLIENT
// =====================================================

export const updateClient = async (req, res) => {

    try {

        const { id } =
            req.params;


        // Find client
        const client =
            await Client.findById(id);


        if (!client) {

            return res.status(404).json({

                success: false,

                message:
                    "Client not found",

            });
        }


        const {
            name,
            isActive,
            removeLogo
        } = req.body;


        console.log(
            "========== UPDATE CLIENT =========="
        );

        console.log(
            "Client ID:",
            id
        );

        console.log(
            "Name:",
            name
        );

        console.log(
            "isActive:",
            isActive
        );

        console.log(
            "removeLogo:",
            removeLogo
        );

        console.log(
            "New file:",
            req.file
        );

        console.log(
            "Old logo:",
            client.logo
        );


        // =================================================
        // VALIDATE NAME
        // =================================================

        if (
            !name ||
            !name.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Client name is required",

            });
        }


        // =================================================
        // UPDATE BASIC FIELDS
        // =================================================

        client.name =
            name.trim();


        client.isActive =
            isActive === "true" ||
            isActive === true;


        // Save old logo before changing it
        const oldLogo =
            client.logo;


        // =================================================
        // NEW LOGO HAS PRIORITY
        // =================================================
        //
        // If user selects a new logo:
        //
        // 1. Delete old logo
        // 2. Save new logo
        //
        // Even if removeLogo=true,
        // new uploaded image wins.
        // =================================================

        if (req.file) {

            // Delete old physical file
            if (oldLogo) {

                deleteLogoFile(
                    oldLogo
                );
            }


            // Save new logo path
            client.logo =
                `/uploads/clients/${req.file.filename}`;


            console.log(
                "New logo saved:",
                client.logo
            );
        }


        // =================================================
        // REMOVE LOGO
        // =================================================
        //
        // Only happens when there is NO new file.
        // =================================================

        else if (
            removeLogo === "true" ||
            removeLogo === true
        ) {

            // Delete physical file
            if (oldLogo) {

                deleteLogoFile(
                    oldLogo
                );
            }


            // Remove MongoDB reference
            client.logo = "";


            console.log(
                "Logo removed"
            );
        }


        // =================================================
        // SAVE CLIENT
        // =================================================

        await client.save();


        console.log(
            "Updated client:",
            client
        );


        console.log(
            "=================================="
        );


        return res.status(200).json({

            success: true,

            message:
                "Client updated successfully",

            client,

        });

    } catch (error) {

        console.error(
            "Update client error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};



// =====================================================
// DELETE CLIENT
// =====================================================

export const deleteClient = async (req, res) => {

    try {

        const client =
            await Client.findById(
                req.params.id
            );


        if (!client) {

            return res.status(404).json({

                success: false,

                message:
                    "Client not found",

            });
        }


        // Delete logo file
        if (client.logo) {

            deleteLogoFile(
                client.logo
            );
        }


        // Delete database record
        await Client.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Client permanently deleted",

        });

    } catch (error) {

        console.error(
            "Delete client error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });
    }
};



// =====================================================
// PUBLIC - GET ACTIVE CLIENTS
// =====================================================

export const getPublicClients = async (
    req,
    res
) => {

    try {

        const clients =
            await Client.find({

                isActive: true,

            })
                .select(
                    "name logo"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            clients,

        });

    } catch (error) {

        console.error(
            "Public clients error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch clients",

        });
    }
};