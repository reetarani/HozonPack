import Modal from "../common/Modal";

function ProductViewModal({
    isOpen,
    onClose,
    product,
}) {
    if (!product) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Product Details"
            onClose={onClose}
        >
            <div className="product-view">

                <div className="mb-4">
                    {product.image ? (
                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            className="img-thumbnail"
                            style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div className="text-muted">
                            No image available
                        </div>
                    )}
                </div>

                <div className="row">

                    <div className="col-md-6 mb-3">
                        <h3>Product Name</h3>
                        <div>
                            <p>{product.name}</p>
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <h3>Slug</h3>
                        <div>
                            <p>{product.slug}</p>
                        </div>
                    </div>

                    <div className="col-12 mb-3">
                        <h3>Description</h3>
                        <div>
                            <p>{product.description}</p>
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <h3>Category</h3>
                        <div>
                            {product.category?.name || "-"}
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <h3>Status</h3>
                        <div className="status-btn">
                            {product.isActive ? (
                                <span className="badge bg-success">
                                    Active
                                </span>
                            ) : (
                                <span className="badge bg-danger">
                                    Inactive
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-12 mb-3">
                        <h3>Industries</h3>

                        <div className="mt-2">
                            <p>
                                {product.industries?.length > 0 ? (
                                    product.industries.map(
                                        (industry) => (
                                            <span
                                                key={industry._id}
                                                className="badge bg-industry me-2"
                                        >
                                            {industry.name}
                                        </span>
                                    )
                                )
                            ) : (
                                "-"
                            )}</p>
                        </div>
                    </div>

                </div>

            </div>
        </Modal>
    );
}

export default ProductViewModal;