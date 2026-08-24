import Hero from "../models/Hero.js";

// CREATE HERO
export const createHero = async (req, res) => {
    try {
        const {
            badge,
            title,
            highlight,
            subtitle,
            buttonText,
            buttonUrl,
            isActive,
        } = req.body;

        // Only one active hero
        if (isActive === true || isActive === "true") {
            await Hero.updateMany(
                {},
                {
                    isActive: false,
                }
            );
        }

        const image = req.file
            ? `/uploads/heroes/${req.file.filename}`
            : "";

        const hero = await Hero.create({
            badge,
            title,
            highlight,
            subtitle,
            buttonText,
            buttonUrl,
            image,
            isActive:
                isActive !== undefined
                    ? isActive
                    : true,
        });

        return res.status(201).json({
            success: true,
            message: "Hero created successfully",
            hero,
        });

    } catch (error) {
        console.error(
            "Create hero error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// GET ALL HEROES
export const getHeroes = async (req, res) => {
    try {
        const heroes = await Hero.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            heroes,
        });

    } catch (error) {
        console.error(
            "Get heroes error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// GET SINGLE HERO
export const getHero = async (req, res) => {
    try {
        const hero = await Hero.findById(
            req.params.id
        );

        if (!hero) {
            return res.status(404).json({
                success: false,
                message: "Hero not found",
            });
        }

        return res.status(200).json({
            success: true,
            hero,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// UPDATE HERO
export const updateHero = async (req, res) => {
    try {
        const hero = await Hero.findById(
            req.params.id
        );

        if (!hero) {
            return res.status(404).json({
                success: false,
                message: "Hero not found",
            });
        }

        const {
            badge,
            title,
            highlight,
            subtitle,
            buttonText,
            buttonUrl,
            isActive,
        } = req.body;

        // If this hero becomes active,
        // deactivate all other heroes
        if (
            isActive === true ||
            isActive === "true"
        ) {
            await Hero.updateMany(
                {
                    _id: {
                        $ne: hero._id,
                    },
                },
                {
                    isActive: false,
                }
            );
        }

        hero.badge = badge;
        hero.title = title;
        hero.highlight = highlight;
        hero.subtitle = subtitle;
        hero.buttonText = buttonText;
        hero.buttonUrl = buttonUrl;

        if (isActive !== undefined) {
            hero.isActive =
                isActive === true ||
                isActive === "true";
        }

        // Update image only if new image uploaded
        if (req.file) {
            hero.image =
                `/uploads/heroes/${req.file.filename}`;
        }

        await hero.save();

        return res.status(200).json({
            success: true,
            message: "Hero updated successfully",
            hero,
        });

    } catch (error) {
        console.error(
            "Update hero error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// DELETE HERO
export const deleteHero = async (req, res) => {
    try {
        const hero = await Hero.findByIdAndDelete(
            req.params.id
        );

        if (!hero) {
            return res.status(404).json({
                success: false,
                message: "Hero not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hero deleted successfully",
        });

    } catch (error) {
        console.error(
            "Delete hero error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// PUBLIC HERO
export const getPublicHero = async (req, res) => {
    try {
        const hero = await Hero.findOne({
            isActive: true,
        }).sort({
            createdAt: -1,
        });

        if (!hero) {
            return res.status(404).json({
                success: false,
                message: "Active hero not found",
            });
        }

        return res.status(200).json({
            success: true,
            hero,
        });

    } catch (error) {
        console.error(
            "Public hero error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch hero",
        });
    }
};

