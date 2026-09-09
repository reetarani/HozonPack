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
    galleryPreview,
    onChange,
    onImageChange,
    onGalleryChange,
    onRemove,
    onRemoveGallery,
    onSubmit,
    isSubmitting,
}) {
    const highlights = formData.highlights || [];

    const addHighlight = () => {
    onChange({
        target: {
            name: "highlights",
            value: [
                {
                    icon: "",
                    title: "",
                    description: "",
                },
                ...highlights,
            ],
        },
    });
};

    const updateHighlight = (index, field, value) => {
        const updatedHighlights = highlights.map((highlight, i) =>
            i === index
                ? {
                      ...highlight,
                      [field]: value,
                  }
                : highlight
        );

        onChange({
            target: {
                name: "highlights",
                value: updatedHighlights,
            },
        });
    };

    const removeHighlight = (index) => {
        const updatedHighlights = highlights.filter(
            (_, i) => i !== index
        );

        onChange({
            target: {
                name: "highlights",
                value: updatedHighlights,
            },
        });
    };

    const iconOptions = [
        { label: "Layers", value: "Layers" },
        { label: "Ruler", value: "Ruler" },
        { label: "Recycle", value: "Recycle" },
        { label: "Shield", value: "Shield" },
        { label: "Box", value: "Box" },
        { label: "Package", value: "Package" },
        { label: "Truck", value: "Truck" },
        { label: "Leaf", value: "Leaf" },
        { label: "Check Circle", value: "CheckCircle" },
        { label: "Factory", value: "Factory" },
        { label: "Settings", value: "Settings" },
    ];

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

            {/* MOQ */}
            <div className="moq-form-row">

                <InputField
                    label="MOQ"
                    name="moq"
                    type="number"
                    value={formData.moq}
                    onChange={onChange}
                    placeholder="Enter Minimum Order Quantity"
                    min="1"
                    required
                    error={errors?.moq}
                />

                <SelectField
                    label="MOQ Unit"
                    name="moqUnit"
                    value={formData.moqUnit || "pcs"}
                    options={[
                        {
                            label: "Pieces (pcs)",
                            value: "pcs",
                        },
                        {
                            label: "Kilograms (kg)",
                            value: "kg",
                        },
                    ]}
                    optionLabel="label"
                    optionValue="value"
                    onChange={onChange}
                    placeholder="Select Unit"
                />

            </div>

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

            {/* Product Highlights */}
            <div className="product-highlights-form mt-4">

                <div className="product-highlights-header">
                    <label className="form-label">
                        Product Highlights
                    </label>

                    <button
                        type="button"
                        className="add-highlight-btn"
                        onClick={addHighlight}
                    >
                        + Add Highlight
                    </button>
                </div>

                {highlights.length === 0 && (
                    <div className="text-muted small mb-3">
                        No highlights added. Click "Add Highlight" to add one.
                    </div>
                )}

                {highlights.map((highlight, index) => (
                    <div
                        key={index}
                        className="product-highlight-item"
                    >
                        <div className="product-highlight-item-header">
                            <strong>
                                Highlight {index + 1}
                            </strong>

                            <button
                                type="button"
                                className="remove-highlight-btn"
                                onClick={() => removeHighlight(index)}
                            >
                                Remove
                            </button>
                        </div>

                        {/* Icon */}
                        <SelectField
                            label="Icon"
                            name={`highlight-icon-${index}`}
                            value={highlight.icon || ""}
                            options={iconOptions}
                            optionLabel="label"
                            optionValue="value"
                            onChange={(e) =>
                                updateHighlight(
                                    index,
                                    "icon",
                                    e.target.value
                                )
                            }
                            placeholder="Select Icon"
                        />

                        {/* Title */}
                        <InputField
                            label="Title"
                            name={`highlight-title-${index}`}
                            value={highlight.title || ""}
                            onChange={(e) =>
                                updateHighlight(
                                    index,
                                    "title",
                                    e.target.value
                                )
                            }
                            placeholder="Enter highlight title"
                        />

                        {/* Description */}
                        <TextAreaField
                            label="Description"
                            name={`highlight-description-${index}`}
                            value={highlight.description || ""}
                            onChange={(e) =>
                                updateHighlight(
                                    index,
                                    "description",
                                    e.target.value
                                )
                            }
                            placeholder="Enter highlight description"
                        />
                    </div>
                ))}
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

            <ImageUpload
                label="Product Image"
                name="image"
                preview={preview}
                onChange={onImageChange}
                onRemove={onRemove}
                required
                error={errors?.image}
            />
            {/* Product Gallery */}
        <div className="product-gallery-form">

            <div className="product-gallery-header">
                <label className="form-label">
                    Product Gallery
                </label>

                <span className="text-muted small">
                    You can select multiple images
                </span>
            </div>

            <input
                type="file"
                name="galleryImages"
                accept="image/*"
                multiple
                onChange={onGalleryChange}
                className="form-control"
            />

            {galleryPreview?.length > 0 && (
    <div className="product-gallery-slider">

        {/* Previous - ONLY MOVE THUMBNAILS */}
        <button
            type="button"
            className="gallery-nav gallery-nav-prev"
            onClick={() => {
                const gallery =
                    document.getElementById(
                        "product-gallery-preview"
                    );

                if (gallery) {
                    gallery.scrollBy({
                        left: -300,
                        behavior: "smooth",
                    });
                }
            }}
            aria-label="Previous thumbnails"
        >
            ‹
        </button>

        {/* Thumbnail Container */}
        <div
            id="product-gallery-preview"
            className="product-gallery-preview"
        >
            {galleryPreview.map((image, index) => (
                <div
                    key={
                        image.id ||
                        image.path ||
                        image.url ||
                        index
                    }
                    className="product-gallery-preview-item"
                >
                    <img
                        src={image.url}
                        alt={`Gallery ${index + 1}`}
                        onClick={() => {
                            // Thumbnail click changes main image
                            // only if you want this behavior
                        }}
                    />

                    <button
                        type="button"
                        className="remove-gallery-image"
                        onClick={() =>
                            onRemoveGallery(index)
                        }
                        aria-label={`Remove gallery image ${index + 1}`}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>

        {/* Next - ONLY MOVE THUMBNAILS */}
        <button
            type="button"
            className="gallery-nav gallery-nav-next"
            onClick={() => {
                const gallery =
                    document.getElementById(
                        "product-gallery-preview"
                    );

                if (gallery) {
                    gallery.scrollBy({
                        left: 300,
                        behavior: "smooth",
                    });
                }
            }}
            aria-label="Next thumbnails"
        >
            ›
        </button>

    </div>
)}
        </div>
        {/* Fast Delivery */}
            <div className="form-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="fastDelivery"
                        checked={formData.fastDelivery || false}
                        onChange={onChange}
                    />

                    <span>
                        Fast Delivery – Available within 24 Hours
                    </span>
                </label>
            </div>
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