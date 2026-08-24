import Testimonial from "../models/Testimonial.js";
export const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      designation,
      company,
      message,
      isActive
    } = req.body;

    const image = req.file
      ? `/uploads/testimonials/${req.file.filename}`
      : "";

    const testimonial = await Testimonial.create({
      name,
      designation,
      company,
      message,
      image,
      isActive
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Get All Testimonials 
export const getTestimonials = async (req, res) => {
    try {
        const { search, status } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

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

        const [testimonials, total] = await Promise.all([
            Testimonial.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Testimonial.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            testimonials,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
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
// Get Single Testimonial
export const getTestimonial = async (req, res) => {
  try {

    const testimonial = await Testimonial.findById(req.params.id)

    if (!testimonial){
        return res.status(404).json(
            {
                success: false,
                message: "Testimonial not found",
            }
        )
       
    }
     res.status(200).json({
            success: true,
            data: testimonial,
        });

  } catch (error) {
    res.status(500).json({
            success: false,
            message: error.message,
        });
  }
};

// Update Testimonial
export const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findById(id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
        }

        testimonial.name = req.body.name;
        testimonial.designation = req.body.designation;
        testimonial.company = req.body.company;
        testimonial.message = req.body.message;
        testimonial.isActive = req.body.isActive;

        // Update image ONLY when a new image is uploaded
        if (req.file) {
            testimonial.image =
                `/uploads/testimonials/${req.file.filename}`;
        }

        await testimonial.save();

        res.status(200).json({
            success: true,
            message: "Testimonial updated successfully",
            testimonial,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(
            req.params.id
        );

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Testimonial permanently deleted",
        });
  } catch (error) {
    console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
  }
};

// Public - Get Active Testimonials
export const getPublicTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({
            isActive: true,
        })
            .select(
                "name designation company message image"
            )
            .sort({ createdAt: -1 });

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
            message: "Unable to fetch testimonials",
        });
    }
};