import "./ProductCard.css";
import { SERVER_URL } from "../../config/env.js";
import { useNavigate } from "react-router-dom";

function ProductCard({
    name,
    slug,
    description,
    moq,
    moqUnit,
    image,
    onEnquire,
}) {
    const navigate = useNavigate();

    const handleLearnMore = () => {
        navigate(`/products/${slug}`);
    };

    const shortDescription =
        description && description.length > 35
            ? `${description.substring(0, 35)}...`
            : description;

    return (
        <div className="product-card">

            {/* Product Image */}
            <div className="product-image">

                {image && (
                    <img
                        src={
                            image.startsWith("http")
                                ? image
                                : `${SERVER_URL}${image}`
                        }
                        alt={`${name} packaging product`}
                        loading="lazy"
                    />
                )}

                {moq !== null &&
                    moq !== undefined &&
                    moq !== "" && (
                        <div className="product-moq-badge">
                            MOQ : {Number(moq).toLocaleString()} {moqUnit || "pcs"}
                        </div>
                    )}

            </div>

            {/* Product Content */}
            <div className="product-content">

                <h3>{name}</h3>

                <p>{shortDescription}</p>

                <div className="product-actions">

                    <button
                        className="learn-more-btn"
                        type="button"
                        onClick={handleLearnMore}
                    >
                        Learn More
                    </button>

                    <button
                        className="enquiry-btn"
                        type="button"
                        onClick={() =>
                            onEnquire({
                                name,
                                moq,
                                moqUnit,
                            })
                        }
                    >
                        Enquire now
                    </button>

                </div>

            </div>

        </div>
    );
}
export default ProductCard;