import Enquiry from "../models/Enquiry.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Industry from "../models/Industry.js";

export const getDashboardStats = async (req, res) => {
    try {

        const totalEnquiries =
            await Enquiry.countDocuments({
                isActive: true,
            });

        const newEnquiries =
            await Enquiry.countDocuments({
                isActive: true,
                status: "new",
            });

        const readEnquiries =
            await Enquiry.countDocuments({
                isActive: true,
                status: "read",
            });
        const totalProducts =
            await Product.countDocuments({
                isActive: true,
            });


        const totalCategories =
            await Category.countDocuments({
                isActive: true,
            });

        const totalIndustries =
            await Industry.countDocuments({
                isActive: true,
            });
        const recentEnquiries = await Enquiry.find({
                isActive: true,
            })
                .sort({ createdAt: -1 })
                .limit(5);

        res.status(200).json({
            success: true,

            stats: {
                totalEnquiries,
                newEnquiries,
                readEnquiries,
                totalProducts,
                totalCategories,
                totalIndustries,
            },

            recentEnquiries,
        });
    } catch (error) {
        console.error(
            "Dashboard stats error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
