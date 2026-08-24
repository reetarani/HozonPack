import CategoryForm from "../forms/CategoryForm";
import "../common/common.css";

function CategoryModal({
    isOpen,
    onClose,
    formData,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop-custom">
            <div className="custom-modal">

                <div className="custom-modal-header">
                    <h4>
                        {formData._id
                            ? "Edit Category"
                            : "Add Category"}
                    </h4>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="custom-modal-body">
                    <CategoryForm
                        formData={formData}
                        errors={errors}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>

            </div>
        </div>
    );
}

export default CategoryModal;