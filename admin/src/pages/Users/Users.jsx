import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import UserModal from "../../components/modals/UserModal";
import api from "../../services/api";
import Toast from "../../components/common/Toast";

import "./User.css";

function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
   const [toast, setToast] = useState({
            message: "",
            type: "success",
        });
    const emptyForm = {
        username: "",
        name: "",
        email: "",
        password: "",
        role: "admin",
        isActive: true,
    };

    const [formData, setFormData] = useState(emptyForm);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleAdd = () => {
        setFormData(emptyForm);
        setErrors({});
        setIsFormOpen(true);
    };
    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };
    const loadUsers = async () => {
        try {
            const response = await api.get("/users", {
                params: {
                    page,
                    limit,
                    ...(search.trim() && {
                        search: search.trim(),
                    }),
                    ...(status && {
                        status,
                    }),
                },
            });

            setUsers(response.data.users || []);

            setTotalPages(
                response.data.pagination?.totalPages || 1
            );

        } catch (error) {
            console.error(
                "Failed to load users:",
                error
            );
        }
    };

    useEffect(() => {
        loadUsers();
    }, [page, search, status]);
const handleChange = (e) => {
    const { name, value } = e.target;

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
const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.username.trim()) {
        newErrors.username = "Username is required.";
    }

    if (!formData.name.trim()) {
        newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
    }

    // Password required only when creating
    if (!formData._id && !formData.password.trim()) {
        newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
        const data = {
            username: formData.username,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            isActive: formData.isActive,
        };

        // Send password only when entered
        if (formData.password.trim()) {
            data.password = formData.password;
        }

        let response;

        if (formData._id) {
    // EDIT
    response = await api.put(
        `/users/${formData._id}`,
        data
    );

    const updatedUser = response.data.user;

    setUsers((prev) =>
        prev.map((item) =>
            item._id === updatedUser._id
                ? updatedUser
                : item
        )
    );
} else {
    // CREATE
    response = await api.post(
        "/users",
        data
    );

    setUsers((prev) => [
        response.data.user,
        ...prev,
    ]);
}

// Toast
setToast({
    message: formData._id
        ? "User updated successfully."
        : "User created successfully.",
    type: "success",
});

setFormData(emptyForm);
setErrors({});
setIsFormOpen(false);
    } catch (error) {
    console.error(
        "Failed to save user:",
        error
    );

    const message =
        error.response?.data?.message ||
        "Failed to save user.";

    setToast({
        message,
        type: "error",
    });

    setErrors({
        general: message,
    });
}
};
const handleEdit = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);

        const user = response.data.data;

        setFormData({
            _id: user._id,
            username: user.username || "",
            name: user.name || "",
            email: user.email || "",
            password: "",
            role: user.role || "admin",
            isActive: user.isActive,
        });

        setErrors({});
        setIsFormOpen(true);

    } catch (error) {
        console.error(
            "Failed to load user:",
            error
        );
    }
};
const confirmDelete = async () => {
    try {
        await api.delete(`/users/${deleteId}`);

        setUsers((prev) =>
            prev.filter((user) => user._id !== deleteId)
        );

        setIsDeleteOpen(false);
        setDeleteId(null);

        setToast({
            message: "User deleted successfully.",
            type: "success",
        });

    } catch (error) {
        console.error(
            "Failed to delete user:",
            error
        );

        const message =
            error.response?.data?.message ||
            "Failed to delete user.";

        setIsDeleteOpen(false);
        setDeleteId(null);

        setToast({
            message,
            type: "error",
        });
    }
};
    return (
        <div className="container-fluid py-4">
            <div className="product-container">

                <PageHeader
                    title="Users"
                    subtitle="Manage admin users"
                    buttonText="Add User"
                     onAdd={handleAdd}
                />

                <div className="toolbar">

                    <input
                        className="search-input"
                        placeholder="Search users..."
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
                        <option value="">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>

                </div>

                <div className="table-box">

                    <table className="product-table">

                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th className="text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user._id}>

                                        <td>
                                            {(page - 1) * limit +
                                                index +
                                                1}
                                        </td>

                                        <td>
                                            {user.username}
                                        </td>

                                        <td>
                                            {user.name}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.role}
                                        </td>

                                        <td>
                                            {user.isActive ? (
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
                                                    onClick={() => handleEdit(user._id)}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="action-btn delete-btn"
                                                    title="Delete"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <FaTrash />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-4"
                                    >
                                        No users found.
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
                            disabled={
                                page === totalPages
                            }
                            onClick={() =>
                                setPage((prev) => prev + 1)
                            }
                        >
                            Next
                        </button>

                    </div>
                )}

            </div>
            <UserModal
                isOpen={isFormOpen}
                onClose={() => {
                    setFormData(emptyForm);
                    setErrors({});
                    setIsFormOpen(false);
                }}
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete User"
                message="Are you sure you want to permanently delete this user?"
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
    );
}

export default Users;