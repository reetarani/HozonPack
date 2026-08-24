import TestimonialForm from "../forms/TestimonialForm";
import "../common/common.css";

function TestimonialModal({
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
                            ? "Edit Testimonial"
                            : "Add Testimonial"}
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
                    <TestimonialForm
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

export default TestimonialModal;