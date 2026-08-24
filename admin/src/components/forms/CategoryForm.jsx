import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import TextAreaField from "../common/TextAreaField";
import Button from "../common/Button";
import "./forms.css";

function CategoryForm({
    formData,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>

            <InputField
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter Category Name"
                required
                error={errors?.name}
            />

            <InputField
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={onChange}
                placeholder="Enter Category Slug"
                required
                error={errors?.slug}
            />
            <TextAreaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Enter Category Description"
                required
                error={errors?.description}
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

            <Button
                type="submit"
                text="Save Category"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            />

        </form>
    );
}

export default CategoryForm;