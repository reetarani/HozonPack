import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import PageHeader from "../../components/common/PageHeader";
import CategoryModal from "../../components/modals/CategoryModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import api from "../../services/api";

import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    permanentlyDeleteCategory,
} from "../../services/categoryService";

import "./Categories.css";
function Categories() {
    const [categories, setCategories] = useState([]);
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        isActive: true,
    });

    const [confirmDelete, setConfirmDelete] = useState({
        isOpen: false,
        category: null,
    });

    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });

const loadCategories = async () => {
    try {
        const params = {};

        if (search.trim()) {
            params.search = search.trim();
        }

        if (status) {
            params.status = status;
        }

        const response = await api.get("/categories", {
            params,
        });

        setCategories(response.data.categories || []);

    } catch (error) {
        console.error("Failed to load categories:", error);
    }
};
      const resetForm = () => {
    setFormData({
        name: "",
        slug: "",
        description: "",
        isActive: true,
    });

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
        [name]: value,
    }));
};
const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
        newErrors.name = "Category name is required.";
    }

    if (!formData.slug.trim()) {
        newErrors.slug = "Category slug is required.";
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
        const data = {
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            isActive:
                formData.isActive === "true"
                    ? true
                    : formData.isActive,
        };

        if (editingId) {
            await updateCategory(editingId, data);

            setToast({
                message: "Category updated successfully!",
                type: "success",
            });
        } else {
            await createCategory(data);

            setToast({
                message: "Category created successfully!",
                type: "success",
            });
        }

        resetForm();
        setIsFormOpen(false);

        await loadCategories();

    } catch (error) {
        console.error("Failed to save category:", error);

        setToast({
            message:
                error.response?.data?.message ||
                "Failed to save category.",
            type: "error",
        });

    } finally {
        setIsSubmitting(false);
    }
};
const handleEdit = async (id) => {
    try {

        const response = await getCategory(id);

        const category = response.category;

        if (!category) {
            throw new Error("Category data not found");
        }

        setFormData({
            name: category.name || "",
            slug: category.slug || "",
            description: category.description || "",
            isActive: category.isActive ?? true,
        });

        setEditingId(id);
        setErrors({});
        setIsFormOpen(true);

    } catch (error) {
        console.error("Failed to load category:", error);

        setToast({
            message:
                error.response?.data?.message ||
                error.message ||
                "Failed to load category.",
            type: "error",
        });
    }
};
const handleDelete = (category) => {
    setConfirmDelete({
        isOpen: true,
        category,
    });
};
const handleConfirmDelete = async () => {
    const category = confirmDelete.category;

    if (!category) {
        return;
    }

    try {
        if (category.isActive) {
            await deleteCategory(category._id);

            setToast({
                message:
                    "Category moved to inactive successfully.",
                type: "success",
            });
        } else {
            await permanentlyDeleteCategory(
                category._id
            );

            setToast({
                message:
                    "Category permanently deleted.",
                type: "success",
            });
        }

        setConfirmDelete({
            isOpen: false,
            category: null,
        });

        await loadCategories();

    } catch (error) {
        console.error(
            "Failed to delete category:",
            error
        );

        setToast({
            message:
                error.response?.data?.message ||
                "Failed to delete category.",
            type: "error",
        });
    }
};
useEffect(() => {
    const urlStatus = searchParams.get("status");

    if (
        urlStatus === "active" ||
        urlStatus === "inactive"
    ) {
        setStatus(urlStatus);
        setPage(1);
    }
}, [searchParams]);

useEffect(() => {
    loadCategories();
}, [search, status]);
       return (
    <div className="container-fluid py-4 product-page">
  <div className="product-container">

            <PageHeader
            title="Categories"
            subtitle="Manage all categories"
            buttonText="Add Category"
            onAdd={handleAdd}
        />

    <div className="toolbar">

        <input
            className="search-input"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
            }}
        />

        <select
            className="status-select"
            value={status}
            onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
            }}
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
              <th>Descriptions</th>
              <th>Products</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
    {categories.length > 0 ? (
        categories.map((category, index) => (
            <tr key={category._id}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td className="text-center">
                    <strong>
                        {category.productCount || 0}
                    </strong>
                </td>
                <td>
                    {category.isActive ? (
                        <span className="badge bg-success">Active</span>
                    ) : (
                        <span className="badge bg-danger">Inactive</span>
                    )}
                </td>

                <td className="text-center">
                    <div className="action-buttons">

                        <button
                            type="button"
                            className="action-btn edit-btn"
                            title="Edit"
                            onClick={() => handleEdit(category._id)}
                        >
                            <FaEdit />
                        </button>

                        <button
                            type="button"
                            className="action-btn delete-btn"
                            title={
                                category.isActive
                                    ? "Move to Inactive"
                                    : "Permanently Delete"
                            }
                            onClick={() => handleDelete(category)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="6" className="text-center py-4">
                <div className="product-count">
                    <span>
                        Total Categories: <strong>{categories.length}</strong>
                    </span>
                </div>
            </td>
        </tr>
    )}
</tbody>
        </table>

        
    </div>
{totalPages > 1 && (
    <div className="pagination-wrapper">

        <button
            type="button"
            disabled={page === 1}
            onClick={() =>
                setPage((prev) => prev - 1)
            }
        >
            Previous
        </button>

        <span>
            Page {page} of {totalPages}
        </span>

        <button
            type="button"
            disabled={page === totalPages}
            onClick={() =>
                setPage((prev) => prev + 1)
            }
        >
            Next
        </button>

    </div>
)}
</div>
<CategoryModal
    isOpen={isFormOpen}
    onClose={() => {
        resetForm();
        setIsFormOpen(false);
    }}
    formData={formData}
    errors={errors}
    onChange={handleChange}
    onSubmit={handleSubmit}
    isSubmitting={isSubmitting}
/>

<ConfirmModal
    isOpen={confirmDelete.isOpen}
    title={
        confirmDelete.category?.isActive
            ? "Deactivate Category"
            : "Permanently Delete Category"
    }
    message={
        confirmDelete.category?.isActive
            ? `Are you sure you want to deactivate "${confirmDelete.category?.name}"?`
            : `Are you sure you want to permanently delete "${confirmDelete.category?.name}"? This action cannot be undone.`
    }
    confirmText={
        confirmDelete.category?.isActive
            ? "Deactivate"
            : "Delete Permanently"
    }
    cancelText="Cancel"
    variant="danger"
    onConfirm={handleConfirmDelete}
    onCancel={() =>
        setConfirmDelete({
            isOpen: false,
            category: null,
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
);}

export default Categories;