import Client from "../models/Client.js";

// Create Client
export const createClient = async (req, res) => {
    try {
        const { name, isActive } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Client name is required",
            });
        }

        const existingClient = await Client.findOne({
            name: name.trim(),
        });

        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: "Client already exists",
            });
        }

        const logo = req.file
            ? `/uploads/clients/${req.file.filename}`
            : "";

        const client = await Client.create({
            name: name.trim(),
            logo,
            isActive:
                isActive !== undefined
                    ? isActive
                    : true,
        });

        res.status(201).json({
            success: true,
            message: "Client created successfully",
            client,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get All Clients
export const getClients = async (req, res) => {
    try {
        const { search, status } = req.query;

        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const filter = {};

        // Search by client name
        if (search && search.trim()) {
            const escapedSearch = search
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

        // Status filter
        if (status === "active") {
            filter.isActive = true;
        }

        if (status === "inactive") {
            filter.isActive = false;
        }

        const [clients, total] =
            await Promise.all([
                Client.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),

                Client.countDocuments(filter),
            ]);

        res.status(200).json({
            success: true,
            clients,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(
                    total / limit
                ),
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get Single Client
export const getClient = async (req, res) => {
    try {
        const client = await Client.findById(
            req.params.id
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        res.status(200).json({
            success: true,
            data: client,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Update Client
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        const { name, isActive } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Client name is required",
            });
        }

        client.name = name.trim();
        client.isActive = isActive;

        // Update logo only when a new image is uploaded
        if (req.file) {
            client.logo =
                `/uploads/clients/${req.file.filename}`;
        }

        await client.save();

        res.status(200).json({
            success: true,
            message: "Client updated successfully",
            client,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Delete Client
export const deleteClient = async (req, res) => {
    try {
        const client =
            await Client.findByIdAndDelete(
                req.params.id
            );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Client permanently deleted",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Public - Get Active Clients
export const getPublicClients = async (req, res) => {
    try {
        const clients = await Client.find({
            isActive: true,
        })
            .select("name logo")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            clients,
        });

    } catch (error) {
        console.error("Public clients error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch clients",
        });
    }
};