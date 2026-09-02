import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import TextAreaField from "../common/TextAreaField";
import Button from "../common/Button";
import "./forms.css";
import "../common/common.css";
function TestimonialForm({
    formData,
    errors,
    onChange,
    onSubmit,
    onRemoveImage,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>

            {/* Name */}
            <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter Name"
                required
                error={errors?.name}
            />

            {/* Designation */}
            <InputField
                label="Designation"
                name="designation"
                value={formData.designation || ""}
                onChange={onChange}
                placeholder="Enter Designation"
                error={errors?.designation}
            />

            {/* Company */}
            <InputField
                label="Company"
                name="company"
                value={formData.company || ""}
                onChange={onChange}
                placeholder="Enter Company"
                error={errors?.company}
            />

            {/* Message */}
            <TextAreaField
                label="Message"
                name="message"
                value={formData.message}
                onChange={onChange}
                placeholder="Enter Testimonial"
                required
                error={errors?.message}
            />

            {/* Image */}
            <div className="form-group mb-3">

                <label className="form-label">
                    Current Image
                </label>

                {/* Existing Image */}
                {formData.imageUrl && !formData.removeImage && (
                    <div className="mb-3">

                        <div className="current-testimonial-image">

                            <img
                                src={`http://localhost:5000${formData.imageUrl}`}
                                alt="Current testimonial"
                                width="135"
                                height="135"
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                    border: "1px solid #ddd",
                                }}
                            />

                            <button
                                type="button"
                                className="remove-logo-btn"
                                onClick={onRemoveImage}
                            >
                                X
                            </button>

                        </div>

                    </div>
                )}

                {/* Upload new image */}
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="form-control"
                    onChange={onChange}
                />

                {errors?.image && (
                    <div className="text-danger mt-1">
                        {errors.image}
                    </div>
                )}

            </div>

            {/* Status */}
            <SelectField
                label="Status"
                name="isActive"
                value={String(formData.isActive)}
                options={[
                    {
                        label: "Active",
                        value: "true",
                    },
                    {
                        label: "Inactive",
                        value: "false",
                    },
                ]}
                optionLabel="label"
                optionValue="value"
                onChange={onChange}
                placeholder="Select Status"
                required
                error={errors?.isActive}
            />

            <Button
                type="submit"
                text={
                    formData._id
                        ? "Update Testimonial"
                        : "Save Testimonial"
                }
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            />

        </form>
    );
}

export default TestimonialForm;