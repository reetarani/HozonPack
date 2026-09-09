function IndustryForm({
    formData,
    errors,
    preview,
    onChange,
    onImageChange,
    onRemove,

    onDescriptionListChange,
    onAddDescriptionList,
    onRemoveDescriptionList,

    onSubmit,
    isSubmitting,
}) {

    const handleFileChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }


        const previewUrl =
            URL.createObjectURL(file);


        onImageChange({
            file,
            preview: previewUrl,
        });


        e.target.value = "";
    };


    return (
        <form
            onSubmit={onSubmit}
            className="industry-form"
        >

            {/* =====================================
                Industry Name
            ====================================== */}

            <div className="form-group">

                <label className="form-label">
                    Industry Name
                </label>

                <input
                    type="text"
                    name="name"
                    className={`form-control ${
                        errors?.name
                            ? "is-invalid"
                            : ""
                    }`}
                    value={
                        formData.name || ""
                    }
                    onChange={onChange}
                    placeholder="Enter industry name"
                />

                {errors?.name && (
                    <div className="invalid-feedback">
                        {errors.name}
                    </div>
                )}

            </div>


            {/* =====================================
                Subtitle
            ====================================== */}

            <div className="form-group">

                <label className="form-label">
                    Subtitle
                </label>

                <input
                    type="text"
                    name="subtitle"
                    className={`form-control ${
                        errors?.subtitle
                            ? "is-invalid"
                            : ""
                    }`}
                    value={
                        formData.subtitle || ""
                    }
                    onChange={onChange}
                    placeholder="e.g. Shelf-ready cartons"
                />

                {errors?.subtitle && (
                    <div className="invalid-feedback">
                        {errors.subtitle}
                    </div>
                )}

            </div>


            {/* =====================================
                Slug
            ====================================== */}

            <div className="form-group">

                <label className="form-label">
                    Slug
                </label>

                <input
                    type="text"
                    name="slug"
                    className="form-control"
                    value={
                        formData.slug || ""
                    }
                    onChange={onChange}
                    placeholder="industry-slug"
                />

            </div>


            {/* =====================================
                Description
            ====================================== */}

            <div className="form-group">

                <label className="form-label">
                    Description
                </label>

                <textarea
                    name="description"
                    rows="4"
                    className={`form-control ${
                        errors?.description
                            ? "is-invalid"
                            : ""
                    }`}
                    value={
                        formData.description || ""
                    }
                    onChange={onChange}
                    placeholder="Enter industry description"
                />

                {errors?.description && (
                    <div className="invalid-feedback">
                        {errors.description}
                    </div>
                )}

            </div>


            {/* =====================================
                Description List
            ====================================== */}

            <div className="form-group">

                <div className="description-list-header">

                    <div>

                        <label className="form-label">
                            Description List
                        </label>

                        <div className="description-list-help">
                            Add label and value details
                            for this industry.
                        </div>

                    </div>


                    <button
                        type="button"
                        className="description-list-add"
                        onClick={
                            onAddDescriptionList
                        }
                    >
                        + Add Item
                    </button>

                </div>


                <div className="description-list-fields">

                    {formData.descriptionList
                        ?.length > 0 ? (

                        formData.descriptionList.map(
                            (
                                item,
                                index
                            ) => (

                                <div
                                    className="description-list-row"
                                    key={index}
                                >

                                    {/* Number */}

                                    <div className="description-list-number">
                                        {index + 1}
                                    </div>


                                    {/* Label */}

                                    <div className="description-list-column">

                                        <label>
                                            Label
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                item.label ||
                                                ""
                                            }
                                            placeholder="e.g. CONSTRUCTION"
                                            onChange={(
                                                e
                                            ) =>
                                                onDescriptionListChange(
                                                    index,
                                                    "label",
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                    </div>


                                    {/* Value */}

                                    <div className="description-list-column">

                                        <label>
                                            Value
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                item.value ||
                                                ""
                                            }
                                            placeholder="e.g. 3–5 ply · 120–180 GSM"
                                            onChange={(
                                                e
                                            ) =>
                                                onDescriptionListChange(
                                                    index,
                                                    "value",
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                    </div>


                                    {/* Remove */}

                                    <button
                                        type="button"
                                        className="description-list-remove"
                                        onClick={() =>
                                            onRemoveDescriptionList(
                                                index
                                            )
                                        }
                                        aria-label="Remove description item"
                                    >
                                        ×
                                    </button>

                                </div>

                            )
                        )

                    ) : (

                        <div className="description-list-empty">

                            No description items added.

                            <br />

                            Click
                            <strong>
                                {" "}+ Add Item
                            </strong>
                            {" "}to add one.

                        </div>

                    )}

                </div>

            </div>


            {/* =====================================
                Image
            ====================================== */}

            <div className="form-group">

                <label className="form-label">
                    Industry Image
                </label>


                {preview && (

                    <div className="industry-image-preview">

                        <img
                            src={preview}
                            alt={
                                formData.name ||
                                "Industry"
                            }
                        />


                        <button
                            type="button"
                            className="industry-image-remove"
                            onClick={onRemove}
                        >
                            ×
                        </button>

                    </div>

                )}


                {!preview && (

                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={
                            handleFileChange
                        }
                    />

                )}


                {errors?.image && (
                    <div className="text-danger mt-1">
                        {errors.image}
                    </div>
                )}

            </div>


            {/* =====================================
                Status
            ====================================== */}

            <div className="form-group">

                <label className="form-label">
                    Status
                </label>

                <select
                    name="isActive"
                    className="form-control"
                    value={
                        String(
                            formData.isActive ??
                            true
                        )
                    }
                    onChange={onChange}
                >

                    <option value="true">
                        Active
                    </option>

                    <option value="false">
                        Inactive
                    </option>

                </select>

            </div>


            {/* =====================================
                Submit
            ====================================== */}

            <div className="form-actions">

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >

                    {isSubmitting
                        ? "Saving..."
                        : "Save Industry"}

                </button>

            </div>

        </form>
    );
}


export default IndustryForm;