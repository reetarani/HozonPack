import "./ProductCard.css";

function ProductCard({
    name,
    description,
    image,
    onEnquire,
}) {
    return (
        <div className="product-card">
            <div className="product-image">
                <img
                    src={image}
                    alt={name}
                />
            </div>
            <div className="product-content">
                <h3>{name}</h3>
                <p>{description}</p>
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