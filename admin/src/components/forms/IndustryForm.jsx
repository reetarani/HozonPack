import InputField from "../common/InputField";
import TextAreaField from "../common/TextAreaField";
import SelectField from "../common/SelectField";
import ImageUpload from "../common/ImageUpload";
import Button from "../common/Button";

function IndustryForm({
    formData,
    errors,
    preview,
    onChange,
    onImageChange,
    onRemove,
    onSubmit,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>

            <InputField
                label="Industry Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter Industry Name"
                required
                error={errors?.name}
            />

            <InputField
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={onChange}
                placeholder="Enter Industry Slug"
                required
                error={errors?.slug}
            />

            <TextAreaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Enter Industry Description"
                required
                error={errors?.description}
            />

            <ImageUpload
                label="Industry Image"
                name="image"
                preview={preview}
                onChange={onImageChange}
                onRemove={onRemove}
                required
                error={errors?.image}
            />

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
                required
                error={errors?.isActive}
            />

            <Button
                type="submit"
                text="Save Industry"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            />

        </form>
    );
}

export default IndustryForm;