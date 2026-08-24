import InputField from "../common/InputField";
import TextAreaField from "../common/TextAreaField";
import SelectField from "../common/SelectField";
import Button from "../common/Button";

import "./forms.css";

function HeroForm({
    formData,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>

            <InputField
                label="Badge"
                name="badge"
                value={formData.badge}
                onChange={onChange}
                placeholder="CUSTOM SOLUTIONS AVAILABLE"
                error={errors?.badge}
            />

            <InputField
                label="Title"
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="Enter Title"
                required
                error={errors?.title}
            />

            <InputField
                label="Highlight"
                name="highlight"
                value={formData.highlight}
                onChange={onChange}
                placeholder="Enter Highlight"
                error={errors?.highlight}
            />

            <TextAreaField
                label="Subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={onChange}
                placeholder="Enter Subtitle"
                required
                error={errors?.subtitle}
            />

            <InputField
                label="Button Text"
                name="buttonText"
                value={formData.buttonText}
                onChange={onChange}
                placeholder="Enter Button Text"
                error={errors?.buttonText}
            />

            <InputField
                label="Button URL"
                name="buttonUrl"
                value={formData.buttonUrl}
                onChange={onChange}
                placeholder="Enter Button URL"
                error={errors?.buttonUrl}
            />

            <div className="form-group mb-3">

                <label className="form-label">
                    Hero Image
                </label>

                {formData.imageUrl && (
                    <div className="form-group mb-3">

                        <label className="form-label">
                            Current Image
                        </label>

                        <div className="hero-current-image">
                            <img
                                src={`http://localhost:5000${formData.imageUrl}`}
                                alt="Current hero"
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
                text={
                    formData._id
                        ? "Update Hero"
                        : "Save Hero"
                }
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            />

        </form>
    );
}

export default HeroForm;