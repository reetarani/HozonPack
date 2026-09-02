import TestimonialForm from "../forms/TestimonialForm";
import "../common/common.css";

function TestimonialModal({
    isOpen,
    onClose,
    formData,
    errors,
    onChange,
    onSubmit,
    onRemoveImage,
    isSubmitting,
}) {

    if (!isOpen) {
        return null;
    }

    return (

        <div className="modal-overlay">

            <div className="modal-content">

                <div className="modal-header">

                    <h3>
                        {formData._id
                            ? "Edit Testimonial"
                            : "Add Testimonial"}
                    </h3>


                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <div className="modal-body">

                    <TestimonialForm

                        formData={
                            formData
                        }

                        errors={
                            errors
                        }

                        onChange={
                            onChange
                        }

                        onSubmit={
                            onSubmit
                        }

                        onRemoveImage={
                            onRemoveImage
                        }

                        isSubmitting={
                            isSubmitting
                        }

                    />

                </div>

            </div>

        </div>
    );
}

export default TestimonialModal;