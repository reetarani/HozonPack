import "./ProductCard.css";

function ProductCard({
    name,
    description,
    moq,
    image,
    onEnquire,
}) {
    return (
        <div className="product-card">

            {/* Product Image */}
            <div className="product-image">

                {image && (
                    <img
                        src={
                            image.startsWith("http")
                                ? image
                                : `http://localhost:5000${image}`
                        }
                        alt={name}
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