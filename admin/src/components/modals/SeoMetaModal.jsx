import { useEffect, useState } from "react";

import {
    createSeoMeta,
    updateSeoMeta,
} from "../../services/seoMetaService";

import "../common/common.css";

    function SeoMetaModal({
    isOpen,
    onClose,
    seoMeta,
    onSuccess,
}) {
    const [formData, setFormData] = useState({
        page: "",
        slug: "",
        metaTitle: "",
        metaKeywords: "",
        metaDescription: "",
        isActive: true,
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (seoMeta) {
            setFormData({
                page: seoMeta.page || "",
                slug: seoMeta.slug || "",
                metaTitle: seoMeta.metaTitle || "",
                metaKeywords:
                    seoMeta.metaKeywords || "",
                metaDescription:
                    seoMeta.metaDescription || "",
                isActive:
                    seoMeta.isActive !== false,
            });
        } else {
            setFormData({
                page: "",
                slug: "",
                metaTitle: "",
                metaKeywords: "",
                metaDescription: "",
                isActive: true,
            });
        }

        setError("");
    }, [seoMeta, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } =
            e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.page.trim()) {
            setError("Page name is required.");
            return;
        }

        if (!formData.slug.trim()) {
            setError("Slug is required.");
            return;
        }

        try {
            setSaving(true);

            if (seoMeta?._id) {
                await updateSeoMeta(
                    seoMeta._id,
                    formData
                );
            } else {
                await createSeoMeta(formData);
            }

            onSuccess();
        } catch (error) {
            console.error(
                "SEO meta save error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to save SEO meta."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-backdrop-custom seo-modal-backdrop">
            <div className="custom-modal seo-custom-modal">

                <div className="custom-modal-header">

                    <h4>
                        {seoMeta
                            ? "Edit SEO Meta"
                            : "Add SEO Meta"}
                    </h4>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <div className="custom-modal-body seo-custom-modal-body">

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                    >

                        {/* Page */}
                        <div className="mb-3">

                            <label className="form-label">
                                Page Name *
                            </label>

                            <input
                                type="text"
                                name="page"
                                className="form-control"
                                value={
                                    formData.page
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Home"
                            />

                        </div>

                        {/* Slug */}
                        <div className="mb-3">

                            <label className="form-label">
                                Page Slug *
                            </label>

                            <input
                                type="text"
                                name="slug"
                                className="form-control"
                                value={
                                    formData.slug
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="/"
                            />

                        </div>

                        {/* Meta Title */}
                        <div className="mb-3">

                            <label className="form-label">
                                Meta Title
                            </label>

                            <input
                                type="text"
                                name="metaTitle"
                                className="form-control"
                                value={
                                    formData.metaTitle
                                }
                                onChange={
                                    handleChange
                                }
                                maxLength={60}
                                placeholder="Enter meta title"
                            />

                            <small className="text-muted">
                                {
                                    formData
                                        .metaTitle
                                        .length
                                }
                                /60 characters
                            </small>

                        </div>

                        {/* Meta Keywords */}
                        <div className="mb-3">

                            <label className="form-label">
                                Meta Keywords
                            </label>

                            <input
                                type="text"
                                name="metaKeywords"
                                className="form-control"
                                value={
                                    formData.metaKeywords
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="corrugated packaging, boxes, packaging"
                            />

                        </div>

                        {/* Meta Description */}
                        <div className="mb-3">

                            <label className="form-label">
                                Meta Description
                            </label>

                            <textarea
                                name="metaDescription"
                                className="form-control"
                                rows="4"
                                maxLength={160}
                                value={
                                    formData.metaDescription
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter meta description"
                            />

                            <small className="text-muted">
                                {
                                    formData
                                        .metaDescription
                                        .length
                                }
                                /160 characters
                            </small>

                        </div>

                        {/* Active */}
                        <div className="form-check mb-3">

                            <input
                                type="checkbox"
                                name="isActive"
                                className="form-check-input"
                                id="seoActive"
                                checked={
                                    formData.isActive
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <label
                                htmlFor="seoActive"
                                className="form-check-label"
                            >
                                Active
                            </label>

                        </div>

                        {/* Buttons */}
                        <div className="d-flex justify-content-end gap-2">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save SEO Meta"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default SeoMetaModal;