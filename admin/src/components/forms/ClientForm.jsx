import { useEffect, useState } from "react";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Button from "../common/Button";
import "./forms.css";

function ClientForm({
    formData,
    errors,
    onChange,
    onSubmit,
    onRemoveLogo,
    isSubmitting,
}) {
    const [previewUrl, setPreviewUrl] = useState("");

    // ==========================================
    // NEW IMAGE PREVIEW
    // ==========================================

    useEffect(() => {
        if (
            formData?.logo &&
            formData.logo instanceof File
        ) {
            const url =
                URL.createObjectURL(
                    formData.logo
                );

            setPreviewUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }

        setPreviewUrl("");

    }, [formData?.logo]);


    // ==========================================
    // IMAGE CHANGE
    // ==========================================

    const handleLogoChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        // Send file to parent
        onChange(e);
    };


    // ==========================================
    // REMOVE LOGO
    // ==========================================

    const handleRemoveLogo = () => {

        setPreviewUrl("");

        if (onRemoveLogo) {
            onRemoveLogo();
        }
    };


    // ==========================================
    // IMAGE SOURCE
    // ==========================================

    const existingLogo =
        formData?.imageUrl
            ? `http://localhost:5000${formData.imageUrl}`
            : "";

    const imageToShow =
        previewUrl ||
        existingLogo;


    return (
        <form onSubmit={onSubmit}>

            {/* =============================== */}
            {/* CLIENT NAME */}
            {/* =============================== */}

            <InputField
                label="Client Name"
                name="name"
                value={
                    formData?.name || ""
                }
                onChange={onChange}
                placeholder="Enter Client Name"
                required
                error={errors?.name}
            />


            {/* =============================== */}
            {/* LOGO */}
            {/* =============================== */}

            <div className="form-group mb-3">

                <label className="form-label">
                    Logo
                </label>


                {/* =========================== */}
                {/* IMAGE PREVIEW */}
                {/* =========================== */}

                {imageToShow && (
                    <div className="current-logo-wrapper">

                        <label className="form-label">
                            Current Logo
                        </label>

                        <div
                            className="logo-preview-container"
                        >

                            <img
                                src={imageToShow}
                                alt="Client logo preview"
                                className="client-logo-preview"
                            />


                            {/* REMOVE BUTTON */}

                            <button
                                type="button"
                                className="remove-logo-btn"
                                onClick={
                                    handleRemoveLogo
                                }
                            >
                                ×
                            </button>

                        </div>

                    </div>
                )}


                {/* =========================== */}
                {/* FILE INPUT */}
                {/* =========================== */}

                <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    className="form-control"
                    onChange={
                        handleLogoChange
                    }
                />


                {errors?.logo && (
                    <div className="text-danger mt-1">
                        {errors.logo}
                    </div>
                )}

            </div>


            {/* =============================== */}
            {/* STATUS */}
            {/* =============================== */}

            <SelectField
                label="Status"
                name="isActive"
                value={
                    String(
                        formData?.isActive
                    )
                }
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


            {/* =============================== */}
            {/* SUBMIT */}
            {/* =============================== */}

            <Button
                type="submit"
                text={
                    formData?._id
                        ? "Update Client"
                        : "Save Client"
                }
                variant="primary"
                loading={
                    isSubmitting
                }
                disabled={
                    isSubmitting
                }
            />

        </form>
    );
}

export default ClientForm;