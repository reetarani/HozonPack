import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import TextAreaField from "../common/TextAreaField";
import Button from "../common/Button";
import "./forms.css";

function TestimonialForm({
    formData,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>

            <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter Name"
                required
                error={errors?.name}
            />

            <InputField
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={onChange}
                placeholder="Enter Designation"
                error={errors?.designation}
            />

            <InputField
                label="Company"
                name="company"
                value={formData.company}
                onChange={onChange}
                placeholder="Enter Company"
                error={errors?.company}
            />

            <TextAreaField
                label="Message"
                name="message"
                value={formData.message}
                onChange={onChange}
                placeholder="Enter Testimonial"
                required
                error={errors?.message}
            />

            <div className="mb-3">
                <label className="form-label">
                    Image
                </label>
                {formData.imageUrl && (
                    <div className="mb-3">
                        <label className="form-label">
                            Current Image
                        </label>

                        <div>
                            <img
                                src={`http://localhost:5000${formData.imageUrl}`}
                                alt="Current testimonial"
                                width="100"
                                height="100"
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>
                    </div>
                )}
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
                text="Save Testimonial"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            />

        </form>
    );
}

export default TestimonialForm;