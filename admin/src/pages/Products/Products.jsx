import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import ProductModal from "../../components/modals/ProductModal";
import ProductViewModal from "../../components/modals/ProductViewModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    permanentlyDeleteProduct,
} from "../../services/productService";

import { getCategories } from "../../services/categoryService";
import { getIndustries } from "../../services/industryService";

import "./Products.css";

function Products() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] =
    useSearchParams();
  const [categories, setCategories] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState({
            isOpen: false,
            product: null,
        });
  const [toast, setToast] = useState({
            message: "",
            type: "success",
        });
  const [totalProducts, setTotalProducts] = useState(0);
        useEffect(() => {
        loadCategories();
        loadIndustries();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts();
        }, 400);

        return () => clearTimeout(timer);
    }, [search, status, page]);
  const loadProducts = async () => {
    try {
        const params = {
            page,
            limit,
        };

        if (search.trim()) {
            params.search = search.trim();
        }

        if (status) {
                params.status = status;
            }

        const response =
            await getProducts(params);

        setProducts(response.data);
        setTotalPages(response.totalPages);
        setTotalProducts(response.total);

    } catch (error) {
        console.error(
            "Failed to load products:",
            error
        );
    }
};
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    moq: "",
    category: "",
    industries: [],
    image: null,
    isActive: true,
});
const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};
    const handleDelete = (product) => {
    setConfirmDelete({
        isOpen: true,
        product,
    });
};
const handleConfirmDelete = async () => {
    const product = confirmDelete.product;

    if (!product) {
        return;
    }

    try {
        if (product.isActive) {
            await deleteProduct(product._id);

            setToast({
                message: "Product moved to inactive successfully.",
                type: "success",
            });
        } else {
            await permanentlyDeleteProduct(product._id);

            setToast({
                message: "Product permanently deleted.",
                type: "success",
            });
        }

        await loadProducts();

        setConfirmDelete({
            isOpen: false,
            product: null,
        });

    } catch (error) {
        console.error("Failed to delete product:", error);

        setToast({
            message:
                error.response?.data?.message ||
                "Failed to delete product.",
            type: "error",
        });
    }
};
const handleImageChange = (e) => {
    const file = e.target.value;

    if (!file) {
        return;
    }

    setFormData((prev) => ({
        ...prev,
        image: file,
    }));

    const imagePreview = URL.createObjectURL(file);

    setPreview(imagePreview);
};
const handleRemoveImage = () => {
    setFormData((prev) => ({
        ...prev,
        image: null,
    }));

    setPreview("");
};
const loadCategories = async () => {
    try {
        const data = await getCategories();

        setCategories(data || []);
    } catch (error) {
        console.error("Failed to load categories:", error);
    }
};

const loadIndustries = async () => {
    try {
        const data = await getIndustries();

        setIndustries(data || []);
    } catch (error) {
        console.error("Failed to load industries:", error);
    }
};
const resetForm = () => {
    setFormData({
        name: "",
        slug: "",
        description: "",
        moq: "",
        category: "",
        industries: [],
        image: null,
        isActive: true,
    });

    setPreview("");
    setErrors({});
    setEditingId(null);
};
const handleAdd = () => {
    resetForm();
    setIsFormOpen(true);
};
const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
        newErrors.name = "Product name is required.";
    }

    if (!formData.slug.trim()) {
        newErrors.slug = "Product slug is required.";
    }

    if (!formData.description.trim()) {
        newErrors.description = "Description is required.";
    }

    if (!formData.category) {
        newErrors.category = "Please select a category.";
    }

    if (!formData.industries.length) {
        newErrors.industries = "Please select at least one industry.";
    }

    // Image required only when creating
    if (!editingId && !formData.image) {
        newErrors.image = "Product image is required.";
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
    data.append("slug", formData.slug);
    data.append("description", formData.description);

    data.append(
        "moq",
        formData.moq
            ? String(formData.moq)
            : ""
    );

    data.append("category", formData.category);

    data.append(
        "industries",
        JSON.stringify(formData.industries)
    );

    data.append(
        "isActive",
        String(formData.isActive)
    );

    if (formData.image) {
        data.append("image", formData.image);
    }

    let response;

    if (editingId) {
        response = await updateProduct(editingId, data);
    } else {
        response = await createProduct(data);
    }

    setToast({
        message: editingId
            ? "Product updated successfully!"
            : "Product created successfully!",
        type: "success",
    });

    // Stop submit loading
    setIsSubmitting(false);

    // Reset form
    resetForm();
    setEditingId(null);

    // Close modal
    setIsFormOpen(false);

    // Refresh list
    loadProducts();

} catch (error) {
    console.error("Product save failed:", error);

    const message =
        error.response?.data?.message ||
        "Failed to save product.";

    setErrors({
        submit: message,
    });

    setToast({
        message,
        type: "error",
    });

} finally {
    setIsSubmitting(false);
}
};
const handleEdit = async (id) => {
    try {
        const response = await getProduct(id);

        const product = response.data;

        setFormData({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            moq: product.moq ?? "",
            category: product.category?._id || "",
            industries:
                product.industries?.map(
                    (industry) => industry._id
                ) || [],
            image: null,
            isActive: product.isActive ?? true,
        });

        if (product.image) {
            const imageUrl = `${API_URL}${product.image}`;
            setPreview(imageUrl);
        } else {
            setPreview("");
        }

        setErrors({});
        setEditingId(id);
        setIsFormOpen(true);

    } catch (error) {
        console.error("Failed to load product:", error);
    }
};
const handleView = async (id) => {
    try {
        const response = await getProduct(id);

        setViewProduct(response.data);
        setIsViewOpen(true);

    } catch (error) {
        console.error("Failed to load product:", error);
    }
};
useEffect(() => {
    const activeParam =
        searchParams.get("active");

    if (activeParam === "true") {
        setStatus("active");
        setPage(1);
    }

    if (activeParam === "false") {
        setStatus("inactive");
        setPage(1);
    }
}, [searchParams]);
  return (
    
   <div className="container-fluid py-4 product-page">
  <div className="product-container">

    <div className="page-header">
            <PageHeader
                title="Products"
                subtitle="Manage all packaging products"
                buttonText="Add Product"
                 onAdd={handleAdd}
            />
    </div>

    <div className="toolbar">
       <input
            className="search-input"
            placeholder="Search products..."
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


    <div className="product-count">
        Total Products: <b>{totalProducts}</b>

        <span>
            Last Updated: Today
        </span>
    </div>


    <div className="table-box">

        <table className="product-table">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Industry</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>

                <td>
                  <div className="fw-semibold">
                    {product.name}
                  </div>
                </td>

                <td>{product.category?.name}</td>

                <td>
                    {product.industries
                        ?.map((industry) => industry.name)
                        .join(", ")}
                </td>

                <td>
                    {product.isActive ? (
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
                            onClick={() => handleView(product._id)}
                        >
                            <FaEye />
                        </button>

                        <button
                            className="action-btn edit-btn"
                            title="Edit"
                            onClick={() => handleEdit(product._id)}
                        >
                            <FaEdit />
                        </button>
                        <button
                            type="button"
                            className="action-btn delete-btn"
                            title={
                                product.isActive
                                    ? "Move to Inactive"
                                    : "Permanently Delete"
                            }
                            onClick={() => handleDelete(product)}
                        >
                            <FaTrash />
                        </button>

                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-5 text-muted">
            No products found.
          </div>
        )}
<ProductModal
     isOpen={isFormOpen}
    onClose={() => {
        resetForm();
        setIsFormOpen(false);
    }}
    formData={formData}
    categories={categories}
    industries={industries}
    errors={errors}
    preview={preview}
    onChange={handleChange}
    onImageChange={handleImageChange}
    onRemove={handleRemoveImage}
    onSubmit={handleSubmit}
    isSubmitting={isSubmitting}
    editingId={editingId}
/>
<ProductViewModal
    isOpen={isViewOpen}
    onClose={() => {
        setIsViewOpen(false);
        setViewProduct(null);
    }}
    product={viewProduct}
/>
    </div>
{totalPages > 1 && (
    <div className="pagination-wrapper">

        <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
        >
            Previous
        </button>

        <span>
            Page {page} of {totalPages}
        </span>

        <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
        >
            Next
        </button>

    </div>
)}
<ConfirmModal
    isOpen={confirmDelete.isOpen}
    title={
        confirmDelete.product?.isActive
            ? "Deactivate Product"
            : "Permanently Delete Product"
    }
    message={
        confirmDelete.product?.isActive
            ? `Are you sure you want to deactivate "${confirmDelete.product?.name}"?`
            : `"${confirmDelete.product?.name}" is already inactive. Are you sure you want to permanently delete it? This action cannot be undone.`
    }
    confirmText={
        confirmDelete.product?.isActive
            ? "Deactivate"
            : "Delete Permanently"
    }
    cancelText="Cancel"
    variant="danger"
    onConfirm={handleConfirmDelete}
    onCancel={() =>
        setConfirmDelete({
            isOpen: false,
            product: null,
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

</div>
  );
}

export default Products;