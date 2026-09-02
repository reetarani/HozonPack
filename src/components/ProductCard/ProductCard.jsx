import "./ProductCard.css";

// Use Vite env for API base or empty string for same-origin
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || "";

function ProductCard({
    name,
    description,
    moq,
    image,
    onEnquire,
}) {
    const src = image
        ? image.startsWith("http")
            ? image
            : `${API_BASE}${image}`
        : null;

    return (
        <div className="product-card">

            {/* Product Image */}
            <div className="product-image">

                {src && (
                    <img
                        src={src}
                        alt={name}
                        loading="lazy"
                        width="400"
                        height="300"
                    />
                )}

                {/* Dynamic MOQ Badge */}
                {moq !== null && moq !== undefined && moq !== "" && (
                    <div className="product-moq-badge">
                        MOQ : {Number(moq).toLocaleString()} pcs
                    </div>
                )}

            </div>

            {/* Product Content */}
            <div className="product-content">

                <h3>{name}</h3>

                <p>{description}</p>

                <div className="product-actions">

                    <button
                        className="learn-more-btn"
                        type="button"
                    >
                        Learn More
                    </button>

                    <button
                        className="enquiry-btn"
                        type="button"
                        onClick={() => onEnquire(name)}
                    >
                        Enquire now
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProductCard;