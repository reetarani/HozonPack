import Modal from "../common/Modal";
import ProductForm from "../forms/ProductForm";

function ProductModal({
    isOpen,
    onClose,
    formData,
    categories,
    industries,
    errors,
    preview,
    onChange,
    onImageChange,
    onRemove,
    onSubmit,
    isSubmitting,
    editingId,
}) {
    return (
        <Modal
            isOpen={isOpen}
            title={editingId ? "Edit Product" : "Add Product"}
            onClose={onClose}
        >
            <ProductForm
                formData={formData}
                categories={categories}
                industries={industries}
                errors={errors}
                preview={preview}
                onChange={onChange}
                onImageChange={onImageChange}
                onRemove={onRemove}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
            />
        </Modal>
    );
}

export default ProductModal;