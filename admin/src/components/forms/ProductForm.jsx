import InputField from "../common/InputField";
import TextAreaField from "../common/TextAreaField";
import SelectField from "../common/SelectField";
import ImageUpload from "../common/ImageUpload";
import MultiSelectField from "../common/MultiSelectField";
import Button from "../common/Button";
import "./forms.css";

function ProductForm({
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
}) {
    return (
        <form onSubmit={onSubmit}>

            <InputField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter Product Name"
                required
                error={errors?.name}
            />

            <InputField
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={onChange}
                placeholder="Enter Product Slug"
                required
                error={errors?.slug}
            />

            <TextAreaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Enter Product Description"
                required
                error={errors?.description}
            />

            <SelectField
                label="Category"
                name="category"
                value={formData.category}
                options={categories}
                optionLabel="name"
                optionValue="_id"
                onChange={onChange}
                placeholder="Select Category"
                required
                error={errors?.category}
            />

            <MultiSelectField
                label="Industries"
                name="industries"
                value={formData.industries}
                options={industries}
                optionLabel="name"
                optionValue="_id"
                onChange={onChange}
                placeholder="Select Industries"
                required
                error={errors?.industries}
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
    placeholder="Select Status"
    required
    error={errors?.isActive}
/>
            <ImageUpload
                label="Product Image"
                name="image"
                preview={preview}
                onChange={onImageChange}
                onRemove={onRemove}
                required
                error={errors?.image}
            />

            <div className="text-end mt-4">
                <Button
                    type="submit"
                    text="Save Product"
                    variant="primary"
                    loading={isSubmitting}
                />
            </div>

        </form>
    );
}

export default ProductForm;