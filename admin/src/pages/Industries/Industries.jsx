import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import IndustryModal from "../../components/modals/IndustryModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import IndustryViewModal from "../../components/modals/IndustryViewModal";

import "./Industries.css";

import api from "../../services/api";

import {
    getIndustry,
    createIndustry,
    updateIndustry,
    deleteIndustry,
    permanentlyDeleteIndustry,
} from "../../services/industryService";
function Industries() {
    const emptyForm = {
    name: "",
    subtitle: "",
    slug: "",
    description: "",
    image: null,
    isActive: true,
};

const [industries, setIndustries] = useState([]);

const [formData, setFormData] = useState(emptyForm);
const [viewIndustry, setViewIndustry] = useState(null);
const [isViewOpen, setIsViewOpen] = useState(false);
const [errors, setErrors] = useState({});
const [preview, setPreview] = useState("");
const [search, setSearch] = useState("");
const [status, setStatus] = useState("");
const [searchParams] = useSearchParams();
const [editingId, setEditingId] = useState(null);
const [isFormOpen, setIsFormOpen] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    industry: null,
});

const [toast, setToast] = useState({
    message: "",
    type: "success",
});
const loadIndustries = async () => {
    try {
        const response = await api.get("/industries", {
            params: {
                ...(search.trim() && {
                    search: search.trim(),
                }),
                ...(status && {
                    status,
                }),
            },
        });

        setIndustries(
            response.data.industries || []
        );

    } catch (error) {
        console.error(
            "Failed to load industries:",
            error
        );
    }
};
useEffect(() => {
    const urlStatus = searchParams.get("status");

    if (
        urlStatus === "active" ||
        urlStatus === "inactive"
    ) {
        setStatus(urlStatus); 
    }
}, [searchParams]);
useEffect(() => {
    const timer = setTimeout(() => {
        loadIndustries();
    }, 400);

    return () => clearTimeout(timer);
}, [search, status]);

const handleRemove = () => {
    setFormData((prev) => ({
        ...prev,
        image: null,
    }));

    setPreview("");
};
const resetForm = () => {
    setFormData(emptyForm);
    setPreview("");
    setErrors({});
    setEditingId(null);
};
const handleAdd = () => {
    resetForm();
    setIsFormOpen(true);
};
const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]:
            name === "isActive"
                ? value === "true"
                : value,
        ...(name === "name" && {
            slug: value
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-"),
        }),
    }));
};
const handleImageChange = (e) => {
    const file = e?.target?.value;

    if (!file) {
        return;
    }

    setFormData((prev) => ({
        ...prev,
        image: file,
    }));

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    setErrors((prev) => ({
        ...prev,
        image: "",
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
        newErrors.name = "Industry name is required.";
    }
    if (!formData.subtitle.trim()) {
        newErrors.subtitle = "Industry subtitle is required.";
    }

    if (!formData.description.trim()) {
        newErrors.description =
            "Industry description is required.";
    }

    if (!editingId && !formData.image) {
        newErrors.image = "Industry image is required.";
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
        const data = new FormData();

        data.append("name", formData.name);
        data.append("subtitle", formData.subtitle);
        data.append("slug", formData.slug);
        data.append(
            "description",
            formData.description
        );
        data.append(
            "isActive",
            String(formData.isActive)
        );

        if (formData.image instanceof File) {
            data.append("image", formData.image);
        }

        if (editingId) {
            await updateIndustry(editingId, data);

            setToast({
                message:
                    "Industry updated successfully!",
                type: "success",
            });
        } else {
            await createIndustry(data);

            setToast({
                message:
                    "Industry created successfully!",
                type: "success",
            });
        }

        resetForm();
        setIsFormOpen(false);

        await loadIndustries();

    } catch (error) {
        console.error(
            "Failed to save industry:",
            error
        );

        setToast({
            message:
                error.response?.data?.message ||
                "Failed to save industry.",
            type: "error",
        });

    } finally {
        setIsSubmitting(false);
    }
};
const API_URL = "http://localhost:5000";

const handleEdit = async (id) => {
    try {
        const response = await getIndustry(id);
        const industry = response.industry;

        if (!industry) {
            throw new Error("Industry data not found");
        }

        setFormData({
            name: industry.name || "",
            subtitle: industry.subtitle || "",
            slug: industry.slug || "",
            description: industry.description || "",
            image: null,
            isActive: industry.isActive ?? true,
        });

        if (industry.image) {
            setPreview(`${API_URL}${industry.image}`);
        } else {
            setPreview("");
        }

        setEditingId(id);
        setErrors({});
        setIsFormOpen(true);

    } catch (error) {
        console.error("Failed to load industry:", error);

        setToast({
            message:
                error.response?.data?.message ||
                "Failed to load industry.",
            type: "error",
        });
    }
};
const handleDelete = (industry) => {
    setConfirmDelete({
        isOpen: true,
        industry,
    });
};
const handleConfirmDelete = async () => {
    const industry = confirmDelete.industry;

    if (!industry) {
        return;
    }

    try {
        if (industry.isActive) {
            // Active → Soft delete
            await deleteIndustry(industry._id);

            setToast({
                message:
                    "Industry moved to inactive successfully.",
                type: "success",
            });
        } else {
            // Inactive → Permanent delete
            await permanentlyDeleteIndustry(
                industry._id
            );

            setToast({
                message:
                    "Industry permanently deleted.",
                type: "success",
            });
        }

        setConfirmDelete({
            isOpen: false,
            industry: null,
        });

        await loadIndustries();

    } catch (error) {
        console.error(
            "Failed to delete industry:",
            error
        );

        setToast({
            message:
                error.response?.data?.message ||
                "Failed to delete industry.",
            type: "error",
        });
    }
};
const handleView = async (id) => {
    try {
        const response = await getIndustry(id);

        const industry = response.industry;

        if (!industry) {
            throw new Error("Industry data not found");
        }

        setViewIndustry(industry);
        setIsViewOpen(true);

    } catch (error) {
        console.error(
            "Failed to load industry:",
            error
        );

        setToast({
            message:
                error.response?.data?.message ||
                "Failed to load industry.",
            type: "error",
        });
    }
};

     return (
    <div className="container-fluid py-4 product-page">
  <div className="product-container">

            <PageHeader
            title="Industries"
            subtitle="Manage all Industries"
            buttonText="Add Industry"
            onAdd={handleAdd}
        />

    <div className="toolbar">

        <input
            className="search-input"
            placeholder="Search Industries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <select
            className="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
        >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>

    </div>


    <div className="table-box">

        <table className="product-table">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Sub-Title</th>
              <th>Descriptions</th>
              <th>Products</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
    {industries.length > 0 ? (
        industries.map((industry, index) => (
            <tr key={industry._id}>
                <td>{index + 1}</td>
                <td>{industry.name}</td>
                <td>{industry.subtitle}</td>
                <td>{industry.description}</td>
                <td className="text-center">
                    <strong>{industry.productCount || 0}</strong>
                </td>

                <td>
                    {industry.isActive ? (
                        <span className="badge bg-success">Active</span>
                    ) : (
                        <span className="badge bg-danger">Inactive</span>
                    )}
                </td>

                <td className="text-center">
                    <div className="action-buttons">
                        <button
                            type="button"
                            className="action-btn view-btn"
                            title="View"
                            onClick={() => handleView(industry._id)}
                        >
                            <FaEye />
                        </button>
                        <button
                            type="button"
                            className="action-btn edit-btn"
                            title="Edit"
                            onClick={() => handleEdit(industry._id)}
                        >
                            <FaEdit />
                        </button>

                        <button
                            type="button"
                            className="action-btn delete-btn"
                            title={
                                industry.isActive
                                    ? "Move to Inactive"
                                    : "Permanently Delete"
                            }
                            onClick={() => handleDelete(industry)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="5" className="text-center py-4">
                <div className="product-count">
                    <span>
                        Total Industries: <strong>{industries.length}</strong>
                    </span>
                </div>
            </td>
        </tr>
    )}
</tbody>
        </table>

        
    </div>

</div>
<IndustryModal
    isOpen={isFormOpen}
    onClose={() => {
        resetForm();
        setIsFormOpen(false);
    }}
    formData={formData}
    errors={errors}
    preview={preview}
    onChange={handleChange}
    onImageChange={handleImageChange}
    onRemove={handleRemove}
    onSubmit={handleSubmit}
    isSubmitting={isSubmitting}
    editingId={editingId}
/>
<IndustryViewModal
    isOpen={isViewOpen}
    onClose={() => {
        setIsViewOpen(false);
        setViewIndustry(null);
    }}
    industry={viewIndustry}
    apiUrl={API_URL}
/>
<ConfirmModal
    isOpen={confirmDelete.isOpen}
    title={
        confirmDelete.industry?.isActive
            ? "Deactivate Industry"
            : "Permanently Delete Industry"
    }
    message={
        confirmDelete.industry?.isActive
            ? `Are you sure you want to deactivate "${confirmDelete.industry?.name}"?`
            : `Are you sure you want to permanently delete "${confirmDelete.industry?.name}"? This action cannot be undone.`
    }
    confirmText={
        confirmDelete.industry?.isActive
            ? "Deactivate"
            : "Delete Permanently"
    }
    cancelText="Cancel"
    variant="danger"
    onConfirm={handleConfirmDelete}
    onCancel={() =>
        setConfirmDelete({
            isOpen: false,
            industry: null,
        })
    }
/>

<Toast
    message={toast.message}
    type={toast.type}
    onClose={() =>
        setToast({
            message: "",
            type: "success",
        })
    }
/>
</div>

);
}

export default Industries;