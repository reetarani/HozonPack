import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    HiOutlineSquare3Stack3D,
    HiOutlineAdjustmentsHorizontal,
    HiOutlineArrowPath,
    HiOutlineShieldCheck,
    HiOutlineCube,
    HiOutlineArchiveBox,
    HiOutlineTruck,
    HiOutlineCheckCircle,
    HiOutlineBuildingOffice2,
    HiOutlineCog6Tooth,
} from "react-icons/hi2";

import Header from "../../components/Header/header.jsx";
import TopBar from "../../components/topbar/topbar";
import Footer from "../../components/footer/footer";
import EnquiryPopup from "../../components/EnquiryPopup/EnquiryPopup";
import CorporateQuote from "../../components/CorporateQuote/CorporateQuote";

import { getProductBySlug } from "../../services/productService";
import { SERVER_URL } from "../../config/env.js";

import "./ProductDetails.css";


/* =========================================
   Highlight Icon Map
========================================= */

const iconMap = {
    Layers: HiOutlineSquare3Stack3D,
    Ruler: HiOutlineAdjustmentsHorizontal,
    Recycle: HiOutlineArrowPath,
    Shield: HiOutlineShieldCheck,
    Box: HiOutlineCube,
    Package: HiOutlineArchiveBox,
    Truck: HiOutlineTruck,
    Leaf: HiOutlineCheckCircle,
    CheckCircle: HiOutlineCheckCircle,
    Factory: HiOutlineBuildingOffice2,
    Settings: HiOutlineCog6Tooth,
};


function ProductDetails({
    initialProduct = null,
    initialTopBar = null,
}) {
    const { slug } = useParams();

    const [product, setProduct] = useState(initialProduct);
    const [loading, setLoading] = useState(!initialProduct);
    const [error, setError] = useState("");

    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(
        initialProduct?.image || null
    );

    /* =========================================
       Fetch Product
    ========================================= */

    useEffect(() => {
        if (initialProduct) {
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProductBySlug(slug);

                if (response.success && response.data) {
                    setProduct(response.data);
                } else {
                    setError("Product not found.");
                }

            } catch (error) {
                console.error(
                    "Failed to load product:",
                    error
                );

                setError("Unable to load product.");

            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }

    }, [slug, initialProduct]);


    /* =========================================
       Loading
    ========================================= */

    if (loading) {
        return (
            <>
                <TopBar initialTopBar={initialTopBar} />

                <Header />

                <main className="product-details-page">

                    <div className="product-details-loading">
                        Loading product...
                    </div>

                </main>

                <Footer />
            </>
        );
    }


    /* =========================================
       Error
    ========================================= */

    if (error || !product) {
        return (
            <>
                <TopBar initialTopBar={initialTopBar} />

                <Header />

                <main className="product-details-page">

                    <div className="product-details-error">

                        <h1>
                            Product Not Found
                        </h1>

                        <p>
                            {error ||
                                "The requested product could not be found."}
                        </p>

                    </div>

                </main>

                <Footer />
            </>
        );
    }


    /* =========================================
       Product Image
    ========================================= */

    /* =========================================
   Product Images
========================================= */

const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("http")
        ? image
        : `${SERVER_URL}${image}`;
};

const productImages = [
    ...(product.image ? [product.image] : []),
    ...(Array.isArray(product.gallery)
        ? product.gallery
        : []),
].filter(Boolean);

/* Remove duplicate images */

const uniqueProductImages = [
    ...new Set(productImages),
];

const currentImage =
    activeImage || uniqueProductImages[0] || null;

const currentImageUrl = getImageUrl(currentImage);


    /* =========================================
       Render
    ========================================= */

    return (
        <>
            <TopBar initialTopBar={initialTopBar} />

            <Header
                onGetQuote={() =>
                    setIsQuoteOpen(true)
                }
            />

            <main className="product-details-page">

                {/* =================================
                    Breadcrumb
                ================================= */}

                <div className="container">

                    <div className="product-breadcrumb">

                        <a href="/products">
                            Products
                        </a>

                        <span>/</span>

                        <span>
                            {product.category?.name ||
                                "Packaging"}
                        </span>

                        <span>/</span>

                        <strong>
                            {product.name}
                        </strong>

                    </div>

                </div>


                {/* =================================
                    Main Product Section
                ================================= */}

                <section className="product-details-main">

                    <div className="container">

                        <div className="product-details-grid">

                            {/* =================================
                                LEFT
                            ================================= */}

                            <div className="product-details-left">

                                <div className="product-image-box">

                                    {/* MOQ Badge */}

                                    {product.moq && (
                                        <div>
                                            {product.moq && (
                                                <div className="product-details-moq-badge">
                                                    MOQ :{" "}
                                                    {Number(product.moq).toLocaleString()} pcs
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Main Image */}

                                    {currentImageUrl ? (
                                        <img
                                            src={currentImageUrl}
                                            alt={product.name}
                                            className="product-details-image"
                                        />
                                    ) : (
                                        <div className="product-details-no-image">
                                            No image available
                                        </div>
                                    )}

                                </div>

                                {/* Gallery */}
                                {uniqueProductImages.length > 1 && (
                                    <div className="product-details-gallery-wrapper">

                                        {/* Previous Thumbnail */}
                                        <button
                                            type="button"
                                            className="product-gallery-arrow product-gallery-prev"
                                            onClick={() => {
                                                const gallery = document.getElementById(
                                                    "product-details-gallery"
                                                );

                                                if (gallery) {
                                                    gallery.scrollBy({
                                                        left: -250,
                                                        behavior: "smooth",
                                                    });
                                                }
                                            }}
                                            aria-label="Previous thumbnails"
                                        >
                                            ‹
                                        </button>

                                        {/* Thumbnail Strip */}
                                        <div
                                            id="product-details-gallery"
                                            className="product-details-gallery"
                                        >
                                            {uniqueProductImages.map((image, index) => (
                                                <button
                                                    type="button"
                                                    key={`${image}-${index}`}
                                                    className={`product-details-gallery-item ${
                                                        currentImage === image ? "active" : ""
                                                    }`}
                                                    onClick={() => setActiveImage(image)}
                                                >
                                                    <img
                                                        src={getImageUrl(image)}
                                                        alt={`${product.name} ${index + 1}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        {/* Next Thumbnail */}
                                        <button
                                            type="button"
                                            className="product-gallery-arrow product-gallery-next"
                                            onClick={() => {
                                                const gallery = document.getElementById(
                                                    "product-details-gallery"
                                                );

                                                if (gallery) {
                                                    gallery.scrollBy({
                                                        left: 250,
                                                        behavior: "smooth",
                                                    });
                                                }
                                            }}
                                            aria-label="Next thumbnails"
                                        >
                                            ›
                                        </button>

                                    </div>
                                )}

                                {/* Image Caption */}

                                <p className="product-image-caption">
                                    Available in custom dimensions,
                                    board grades and print finishes
                                </p>

                            </div>

                            {/* =================================
                                RIGHT
                            ================================= */}

                            <div className="product-details-right">

                                {/* Category */}

                                {product.category?.name && (
                                    <div className="product-details-category">
                                        {product.category.name}
                                    </div>
                                )}


                                {/* Product Name */}

                                <h1>
                                    {product.name}
                                </h1>


                                {/* Description */}

                                <div
                                    className="product-details-description"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            product.description ||
                                            "",
                                    }}
                                />


                                {/* =================================
                                    Highlights
                                ================================= */}

                                {product.highlights?.length >
                                    0 && (
                                    <div className="product-details-highlights">

                                        {product.highlights.map(
                                            (
                                                highlight,
                                                index
                                            ) => {

                                                const Icon =
                                                    iconMap[
                                                        highlight.icon
                                                    ];

                                                return (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                        className="product-detail-highlight"
                                                    >

                                                        <div className="product-detail-highlight-icon">

                                                            {Icon ? (
                                                                <Icon />
                                                            ) : (
                                                                <HiOutlineCheckCircle />
                                                            )}

                                                        </div>

                                                        <div className="product-detail-highlight-content">

                                                            <h3>
                                                                {
                                                                    highlight.title
                                                                }
                                                            </h3>

                                                            <p>
                                                                {
                                                                    highlight.description
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                )}


                                {/* =================================
                                    Enquiry Card
                                ================================= */}

                                <div className="product-enquiry-card">

                                    <h2>
                                        Need a box built
                                        for your product?
                                    </h2>

                                    <p>
                                        Share your size,
                                        quantity and
                                        delivery needs.
                                        Our packaging team
                                        will recommend the
                                        right specification.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsQuoteOpen(
                                                true
                                            )
                                        }
                                    >
                                        Enquire now
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            {/* =================================
                Enquiry Popup
            ================================= */}

            <EnquiryPopup
                isOpen={isQuoteOpen}
                selectedProduct={
                    product.name
                }
                selectedProductMOQ={
                    product.moq || ""
                }
                showProduct={true}
                onClose={() => {
                    setIsQuoteOpen(false);
                }}
            />
            <CorporateQuote />
            <Footer />

        </>
    );
}

export default ProductDetails;