import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import TopBarModal from "../../components/modals/TopBarModal";

import api from "../../services/api";

import "./TopBar.css";

function TopBar() {
    const [topBars, setTopBars] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        couponCode: "",
        endDate: "",
        linkText: "Shop now",
        linkUrl: "/",
        isActive: true,
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });

    // Load Top Bars
    const loadTopBars = async () => {
        try {
            const response = await api.get("/topbar");

            setTopBars(response.data.topBars || []);
        } catch (error) {
            console.error(
                "Failed to load top bars:",
                error
            );

            setToast({
                message: "Failed to load top bars.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        loadTopBars();
    }, []);

    // Add
    const handleAdd = () => {
        setFormData({
            title: "",
            couponCode: "",
            endDate: "",
            linkText: "Shop now",
            linkUrl: "/",
            isActive: true,
        });

        setErrors({});
        setIsFormOpen(true);
    };

    // Edit
    const handleEdit = async (id) => {
        try {
            const response = await api.get(
                `/topbar/${id}`
            );

            const topBar = response.data.topBar;

            setFormData({
                _id: topBar._id,
                title: topBar.title || "",
                couponCode: topBar.couponCode || "",
                endDate: topBar.endDate
                    ? topBar.endDate.slice(0, 16)
                    : "",
                linkText: topBar.linkText || "Shop now",
                linkUrl: topBar.linkUrl || "/",
                isActive: topBar.isActive ?? true,
            });

            setErrors({});
            setIsFormOpen(true);
        } catch (error) {
            console.error(
                "Failed to load top bar:",
                error
            );

            setToast({
                message: "Failed to load top bar.",
                type: "error",
            });
        }
    };

    // Form change
    const handleChange = (e) => {
    const {
        name,
        value,
    } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]:
            name === "isActive"
                ? value === "true"
                : value,
    }));

    setErrors((prev) => ({
        ...prev,
        [name]: "",
    }));
};

    // Save
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title =
                "Offer text is required.";
        }

        if (!formData.endDate) {
            newErrors.endDate =
                "End date is required.";
        }

        if (
            Object.keys(newErrors).length
        ) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const data = {
                title: formData.title,
                couponCode: formData.couponCode,
                endDate: formData.endDate,
                linkText: formData.linkText,
                linkUrl: formData.linkUrl,
                isActive: formData.isActive,
            };

            let response;

            if (formData._id) {
                response = await api.put(
                    `/topbar/${formData._id}`,
                    data
                );
            } else {
                response = await api.post(
                    "/topbar",
                    data
                );
            }

            const savedTopBar =
                response.data.topBar;

            if (formData._id) {
                setTopBars((prev) =>
                    prev.map((item) =>
                        item._id ===
                        savedTopBar._id
                            ? savedTopBar
                            : item
                    )
                );
            } else {
                setTopBars((prev) => [
                    savedTopBar,
                    ...prev,
                ]);
            }

            setToast({
                message: formData._id
                    ? "Top bar updated successfully."
                    : "Top bar created successfully.",
                type: "success",
            });

            setFormData({
                title: "",
                couponCode: "",
                endDate: "",
                linkText: "Shop now",
                linkUrl: "/",
                isActive: true,
            });

            setErrors({});
            setIsFormOpen(false);

        } catch (error) {
            console.error(
                "Failed to save top bar:",
                error
            );

            setToast({
                message:
                    error.response?.data?.message ||
                    "Failed to save top bar.",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete
    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(
                `/topbar/${deleteId}`
            );

            setTopBars((prev) =>
                prev.filter(
                    (item) =>
                        item._id !== deleteId
                )
            );

            setIsDeleteOpen(false);
            setDeleteId(null);

            setToast({
                message:
                    "Top bar deleted successfully.",
                type: "success",
            });

        } catch (error) {
            console.error(
                "Failed to delete top bar:",
                error
            );

            setToast({
                message:
                    "Failed to delete top bar.",
                type: "error",
            });
        }
    };

    return (
        <div className="container-fluid py-4">

            <div className="product-container">

                <PageHeader
                    title="Top Bar"
                    subtitle="Manage website promotional top bar"
                    buttonText="Add Top Bar"
                    onAdd={handleAdd}
                />

                <div className="table-box">

                    <table className="product-table">

                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Offer</th>
                                <th>Coupon</th>
                                <th>End Date</th>
                                <th>Link</th>
                                <th>Status</th>
                                <th className="text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {topBars.length > 0 ? (

                                topBars.map(
                                    (topBar, index) => (

                                        <tr
                                            key={
                                                topBar._id
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                {topBar.title}
                                            </td>

                                            <td>
                                                {topBar.couponCode ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {new Date(
                                                    topBar.endDate
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {topBar.linkText ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {topBar.isActive ? (
                                                    <span className="badge bg-success">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            <td className="text-center">

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="action-btn edit-btn"
                                                        title="Edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                topBar._id
                                                            )
                                                        }
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                topBar._id
                                                            )
                                                        }
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )

                            ) : (

                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-4"
                                    >
                                        No top bars found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {isFormOpen && (
                    <TopBarModal
                        isOpen={isFormOpen}
                        onClose={() => {
                            setErrors({});
                            setIsFormOpen(false);
                        }}
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}

                <ConfirmModal
                    isOpen={isDeleteOpen}
                    title="Delete Top Bar"
                    message="Are you sure you want to permanently delete this top bar?"
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setIsDeleteOpen(false);
                        setDeleteId(null);
                    }}
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

export default TopBar;