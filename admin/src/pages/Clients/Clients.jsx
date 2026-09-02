import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import ClientModal from "../../components/modals/ClientModal";
import api from "../../services/api";

import "./Clients.css";

function Clients() {

    const emptyForm = {
        name: "",
        logo: null,
        imageUrl: "",
        removeLogo: false,
        isActive: true,
    };

    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [formData, setFormData] =
        useState(emptyForm);

    const [logoPreview, setLogoPreview] =
        useState("");

    const [isFormOpen, setIsFormOpen] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    const [deleteId, setDeleteId] =
        useState(null);

    const [isDeleteOpen, setIsDeleteOpen] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [limit] =
        useState(10);

    const [totalPages, setTotalPages] =
        useState(1);

    const [toast, setToast] =
        useState({
            message: "",
            type: "success",
        });


    // =====================================================
    // ADD CLIENT
    // =====================================================

    const handleAdd = () => {

        setFormData({
            ...emptyForm,
        });

        setLogoPreview("");

        setErrors({});

        setIsFormOpen(true);
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            files,
            type,
            checked,
        } = e.target;


        // -----------------------------
        // FILE UPLOAD
        // -----------------------------

        if (
            type === "file" &&
            name === "logo"
        ) {

            const file =
                files?.[0];

            if (!file) {
                return;
            }


            // Save file
            setFormData((prev) => ({
                ...prev,
                logo: file,

                // If user selects a new
                // image, don't remove it.
                removeLogo: false,
            }));


            // Remove previous object URL
            setLogoPreview((oldPreview) => {

                if (
                    oldPreview &&
                    oldPreview.startsWith("blob:")
                ) {
                    URL.revokeObjectURL(
                        oldPreview
                    );
                }

                return URL.createObjectURL(
                    file
                );
            });


            setErrors((prev) => ({
                ...prev,
                logo: "",
            }));

            return;
        }


        // -----------------------------
        // NORMAL INPUT
        // -----------------------------

        let fieldValue = value;


        if (type === "checkbox") {

            fieldValue = checked;

        } else if (
            name === "isActive"
        ) {

            fieldValue =
                value === "true";
        }


        setFormData((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));


        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };


    // =====================================================
    // LOAD CLIENTS
    // =====================================================

    const loadClients = async () => {

        try {

            const response =
                await api.get(
                    "/clients",
                    {
                        params: {
                            page,
                            limit,

                            ...(search.trim() && {
                                search:
                                    search.trim(),
                            }),

                            ...(status && {
                                status,
                            }),
                        },
                    }
                );


            setClients(
                response.data.clients || []
            );


            setTotalPages(
                response.data.pagination
                    ?.totalPages || 1
            );

        } catch (error) {

            console.error(
                "Failed to load clients:",
                error
            );


            setToast({
                message:
                    error.response?.data
                        ?.message ||
                    "Failed to load clients.",
                type: "error",
            });
        }
    };


    useEffect(() => {

        loadClients();

    }, [
        page,
        search,
        status,
    ]);


    // =====================================================
    // CREATE / UPDATE CLIENT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        const newErrors = {};


        // Name validation
        if (
            !formData.name ||
            !formData.name.trim()
        ) {

            newErrors.name =
                "Client name is required.";
        }


        if (
            Object.keys(newErrors).length > 0
        ) {

            setErrors(newErrors);

            return;
        }


        setErrors({});

        setIsSubmitting(true);


        try {

            const data =
                new FormData();


            // Name
            data.append(
                "name",
                formData.name.trim()
            );


            // Active
            data.append(
                "isActive",
                String(formData.isActive)
            );


            // New logo
            if (formData.logo) {

                data.append(
                    "logo",
                    formData.logo
                );
            }


            // Remove old logo
            if (formData.removeLogo) {

                data.append(
                    "removeLogo",
                    "true"
                );
            }


            console.log(
                "========== CLIENT SUBMIT =========="
            );

            console.log(
                "ID:",
                formData._id
            );

            console.log(
                "Logo:",
                formData.logo
            );

            console.log(
                "Image URL:",
                formData.imageUrl
            );

            console.log(
                "Remove Logo:",
                formData.removeLogo
            );


            // =================================================
            // UPDATE
            // =================================================

            if (formData._id) {

                const response =
                    await api.put(
                        `/clients/${formData._id}`,
                        data
                    );


                const updatedClient =
                    response.data.client;


                setClients((prev) =>
                    prev.map((item) =>
                        item._id ===
                        updatedClient._id
                            ? updatedClient
                            : item
                    )
                );


                setToast({
                    message:
                        "Client updated successfully.",
                    type: "success",
                });

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                const response =
                    await api.post(
                        "/clients",
                        data
                    );


                setClients((prev) => [
                    response.data.client,
                    ...prev,
                ]);


                setToast({
                    message:
                        "Client created successfully.",
                    type: "success",
                });
            }


            // Reset
            setFormData({
                ...emptyForm,
            });

            setLogoPreview("");

            setErrors({});

            setIsFormOpen(false);

        } catch (error) {

            console.error(
                "Failed to save client:",
                error
            );


            setToast({
                message:
                    error.response?.data
                        ?.message ||
                    "Failed to save client.",
                type: "error",
            });

        } finally {

            setIsSubmitting(false);
        }
    };


    // =====================================================
    // EDIT CLIENT
    // =====================================================

    const handleEdit = async (id) => {

        try {

            const response =
                await api.get(
                    `/clients/${id}`
                );


            const client =
                response.data.data;


            setFormData({

                _id:
                    client._id,

                name:
                    client.name || "",

                // Important:
                // Don't put old image into logo.
                logo:
                    null,

                imageUrl:
                    client.logo || "",

                removeLogo:
                    false,

                isActive:
                    client.isActive,
            });


            // Existing image preview
            if (client.logo) {

                setLogoPreview(
                    `http://localhost:5000${client.logo}`
                );

            } else {

                setLogoPreview("");
            }


            setErrors({});

            setIsFormOpen(true);

        } catch (error) {

            console.error(
                "Failed to load client:",
                error
            );


            setToast({
                message:
                    "Failed to load client.",
                type: "error",
            });
        }
    };


    // =====================================================
    // REMOVE LOGO
    // =====================================================

    const handleRemoveLogo = () => {

        setFormData((prev) => ({
            ...prev,

            // Remove newly selected file
            logo: null,

            // Remove old image reference
            imageUrl: "",

            // Tell backend to remove image
            removeLogo: true,
        }));


        setLogoPreview((oldPreview) => {

            if (
                oldPreview &&
                oldPreview.startsWith("blob:")
            ) {
                URL.revokeObjectURL(
                    oldPreview
                );
            }

            return "";
        });
    };


    // =====================================================
    // DELETE CLIENT
    // =====================================================

    const handleDelete = (id) => {

        setDeleteId(id);

        setIsDeleteOpen(true);
    };


    const confirmDelete = async () => {

        try {

            await api.delete(
                `/clients/${deleteId}`
            );


            setClients((prev) =>
                prev.filter(
                    (item) =>
                        item._id !==
                        deleteId
                )
            );


            setIsDeleteOpen(false);

            setDeleteId(null);


            setToast({
                message:
                    "Client deleted successfully.",
                type: "success",
            });

        } catch (error) {

            console.error(
                "Failed to delete client:",
                error
            );


            setToast({
                message:
                    error.response?.data
                        ?.message ||
                    "Failed to delete client.",
                type: "error",
            });
        }
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleCloseModal = () => {

        setFormData({
            ...emptyForm,
        });

        setLogoPreview("");

        setErrors({});

        setIsFormOpen(false);
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="container-fluid py-4">

            <div className="product-container">

                <PageHeader
                    title="Clients"
                    subtitle="Manage all Clients"
                    buttonText="Add Client"
                    onAdd={handleAdd}
                />


                {/* ================= TOOLBAR ================= */}

                <div className="toolbar">

                    <input
                        className="search-input"
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) => {

                            setSearch(
                                e.target.value
                            );

                            setPage(1);
                        }}
                    />


                    <select
                        className="status-select"
                        value={status}
                        onChange={(e) => {

                            setStatus(
                                e.target.value
                            );

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


                {/* ================= TABLE ================= */}

                <div className="table-box">

                    <table className="product-table">

                        <thead className="table-light">

                            <tr>

                                <th>#</th>

                                <th>
                                    Logo
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Status
                                </th>

                                <th className="text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {clients.length > 0 ? (

                                clients.map(
                                    (
                                        client,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                client._id
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>


                                            <td>

                                                {client.logo ? (

                                                    <img
                                                        src={`http://localhost:5000${client.logo}`}
                                                        alt={
                                                            client.name
                                                        }
                                                        width="50"
                                                        height="50"
                                                        style={{
                                                            objectFit:
                                                                "contain",
                                                        }}
                                                    />

                                                ) : (

                                                    "-"
                                                )}

                                            </td>


                                            <td>
                                                {
                                                    client.name
                                                }
                                            </td>


                                            <td>

                                                {client.isActive ? (

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
                                                                client._id
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
                                                                client._id
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
                                        colSpan="5"
                                        className="text-center py-4"
                                    >
                                        No clients found.
                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>


                {/* ================= PAGINATION ================= */}

                {totalPages > 1 && (

                    <div className="pagination-wrapper">

                        <button
                            type="button"
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                setPage(
                                    (prev) =>
                                        prev - 1
                                )
                            }
                        >
                            Previous
                        </button>


                        <span>
                            Page {page} of{" "}
                            {totalPages}
                        </span>


                        <button
                            type="button"
                            disabled={
                                page ===
                                totalPages
                            }
                            onClick={() =>
                                setPage(
                                    (prev) =>
                                        prev + 1
                                )
                            }
                        >
                            Next
                        </button>

                    </div>
                )}


                {/* ================= CLIENT MODAL ================= */}

                <ClientModal
                    isOpen={isFormOpen}
                    onClose={
                        handleCloseModal
                    }
                    formData={
                        formData
                    }
                    errors={
                        errors
                    }
                    onChange={
                        handleChange
                    }
                    onRemoveLogo={
                        handleRemoveLogo
                    }
                    logoPreview={
                        logoPreview
                    }
                    onSubmit={
                        handleSubmit
                    }
                    isSubmitting={
                        isSubmitting
                    }
                />


                {/* ================= DELETE MODAL ================= */}

                <ConfirmModal
                    isOpen={
                        isDeleteOpen
                    }
                    title="Delete Client"
                    message="Are you sure you want to permanently delete this client?"
                    onConfirm={
                        confirmDelete
                    }
                    onCancel={() => {

                        setIsDeleteOpen(
                            false
                        );

                        setDeleteId(null);
                    }}
                />


                {/* ================= TOAST ================= */}

                <Toast
                    message={
                        toast.message
                    }
                    type={
                        toast.type
                    }
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

export default Clients;