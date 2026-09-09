import { useState } from "react";
import Modal from "../common/Modal";
import { SERVER_URL } from "../../services/api";
import "./ProductViewModal.css";

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

function ProductViewModal({
    isOpen,
    onClose,
    product,
}) {
    const [activeImage, setActiveImage] = useState(null);

    if (!isOpen || !product) {
        return null;
    }

    /*
     * Main image + gallery images
     */
    const allImages = [
        ...(product.image ? [product.image] : []),
        ...(Array.isArray(product.gallery) ? product.gallery : []),
    ].filter(Boolean);

    /*
     * Remove duplicate main image if it also exists in gallery
     */
    const uniqueImages = [...new Set(allImages)];

    const currentImage = activeImage || uniqueImages[0] || null;

    return (
        <Modal
            isOpen={isOpen}
            title="Product Details"
            onClose={onClose}
        >
            <div className="product-view">

                {/* Top Product Information */}
                <div className="product-view-main">

                    {/* Product Image */}
                    <div className="product-view-image-section">

                        <div className="product-view-image-wrapper">
                            {currentImage ? (
                                <img
                                    src={`${SERVER_URL}${currentImage}`}
                                    alt={product.name || "Product"}
                                    className="product-view-image"
                                />
                            ) : (
                                <div className="product-view-no-image">
                                    No image available
                                </div>
                            )}
                        </div>

                        {/* Gallery */}
                        {uniqueImages.length > 1 && (
                            <div className="product-view-gallery">

                                {uniqueImages.map((image, index) => (
                                    <button
                                        type="button"
                                        key={`${image}-${index}`}
                                        className={`product-view-gallery-item ${
                                            currentImage === image
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setActiveImage(image)
                                        }
                                    >
                                        <img
                                            src={`${SERVER_URL}${image}`}
                                            alt={`${product.name || "Product"} ${
                                                index + 1
                                            }`}
                                        />
                                    </button>
                                ))}

                            </div>
                        )}

                    </div>

                    {/* Product Information */}
                    <div className="product-view-info">

                        <div className="product-view-field">
                            <span className="product-view-label">
                                Product Name
                            </span>

                            <h2>
                                {product.name || "-"}
                            </h2>
                        </div>

                        <div className="product-view-field">
                            <span className="product-view-label">
                                Slug
                            </span>

                            <p className="product-view-slug">
                                {product.slug || "-"}
                            </p>
                        </div>

                        <div className="product-view-meta">

                            {/* MOQ */}
                            <div>
                                <span className="product-view-label">
                                    MOQ
                                </span>

                                <strong>
                                    {product.moq || "-"}
                                </strong>
                            </div>

                            {/* Category */}
                            <div>
                                <span className="product-view-label">
                                    Category
                                </span>

                                <strong>
                                    {product.category?.name || "-"}
                                </strong>
                            </div>
                            {/* Fast Delivery */}
                            <div>
                                <span className="product-view-label">
                                    Delivery
                                </span>

                                {product.fastDelivery ? (
                                    <span className="product-status active">
                                        Fast Delivery – 24 Hours
                                    </span>
                                ) : (
                                    <span className="product-status inactive">
                                        Standard Delivery
                                    </span>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <span className="product-view-label">
                                    Status
                                </span>

                                {product.isActive ? (
                                    <span className="product-status active">
                                        Active
                                    </span>
                                ) : (
                                    <span className="product-status inactive">
                                        Inactive
                                    </span>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="product-view-section">
                    <h3>Description</h3>

                    <p className="product-view-description">
                        {product.description || "-"}
                    </p>
                </div>

                {/* Industries */}
                <div className="product-view-section">
                    <h3>Industries</h3>

                    {product.industries?.length > 0 ? (
                        <div className="product-industries">
                            {product.industries.map((industry) => (
                                <span
                                    key={industry._id}
                                    className="product-industry-badge"
                                >
                                    {industry.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="product-view-empty">
                            No industries assigned.
                        </p>
                    )}
                </div>

                {/* Product Highlights */}
                <div className="product-view-section">
                    <h3>Product Highlights</h3>

                    {product.highlights?.length > 0 ? (
                        <div className="product-view-highlights">

                            {product.highlights.map(
                                (highlight, index) => {
                                    const Icon =
                                        iconMap[highlight.icon];

                                    return (
                                        <div
                                            key={index}
                                            className="product-view-highlight"
                                        >
                                            <div className="product-view-highlight-icon">
                                                {Icon ? (
                                                    <Icon />
                                                ) : (
                                                    <span>•</span>
                                                )}
                                            </div>

                                            <div className="product-view-highlight-content">
                                                <h4>
                                                    {highlight.title || "-"}
                                                </h4>

                                                <p>
                                                    {highlight.description || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                        </div>
                    ) : (
                        <p className="product-view-empty">
                            No highlights added.
                        </p>
                    )}
                </div>

            </div>
        </Modal>
    );
}

export default ProductViewModal;