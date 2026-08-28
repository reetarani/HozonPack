import express from "express";
import cors from "cors";
import path from "path";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import testimonialsRouts from "./routes/testimonialRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import publicClientRoutes from "./routes/publicClientRoutes.js";
import publicTestimonialRoutes from "./routes/publicTestimonialRoutes.js";
import publicProductRoutes from "./routes/publicProductRoutes.js";
import publicCategoryRoutes from "./routes/publicCategoryRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import publicHeroRoutes from "./routes/publicHeroRoutes.js";
import publicEnquiryRoutes from "./routes/publicEnquiryRoutes.js";
import publicSearchRoutes from "./routes/publicSearchRoutes.js";
import searchKeywordRoutes from "./routes/searchKeywordRoutes.js";
import seoMetaRoutes from "./routes/seoMetaRoutes.js";
import publicSeoMetaRoutes from "./routes/publicSeoMetaRoutes.js";
import publicIndustryRoutes from "./routes/publicIndustryRoutes.js";


const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5177",
             "http://localhost:5178",
             "http://localhost:5174",
             "http://localhost:5175",
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use(
    "/uploads",
   express.static(
        path.join(process.cwd(), "src", "uploads")
    )
);
app.use(
    "/api/dashboard",
    dashboardRoutes
);
app.use("/api/categories", categoryRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/testimonials", testimonialsRouts);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/public", publicClientRoutes);
app.use("/api/public", publicTestimonialRoutes);
app.use("/api/public", publicProductRoutes);
app.use("/api/public", publicCategoryRoutes);
app.use("/api/heroes", heroRoutes);
app.use("/api/public", publicHeroRoutes);
app.use("/api/public", publicEnquiryRoutes);
app.use("/api/public", publicSearchRoutes);
app.use("/api/search-keywords", searchKeywordRoutes);
app.use("/api/seo-meta", seoMetaRoutes);
app.use(
    "/api/public",
    publicSeoMetaRoutes
);
app.use(
    "/api/public/industries",
    publicIndustryRoutes
);
app.get("/api/public/search-test", (req, res) => {
    res.json({
        success: true,
        message: "Public search route is working",
    });
});
export default app;