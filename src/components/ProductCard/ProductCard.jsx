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
            <div className="product-image">
                {image && (
                    <img
                        src={
                            image
                                ? image.startsWith("http")
                                    ? image
                                    : `http://localhost:5000${image}`
                                : "/images/product-placeholder.png"
                        }
                        alt={name}
                    />
                )}
            </div>
            <div className="product-content">
                <h3>{name}</h3>
                <p>{description}</p>
                {moq && (
                    <p className="product-moq">
                        MOQ: {Number(moq).toLocaleString()} units
                    </p>
                )}
                <button
                    className="enquiry-btn"
                    onClick={() => onEnquire(name)}
                >
                    Enquire Now →
                </button>
            </div>
        </div>
    );
}

export default ProductCard;