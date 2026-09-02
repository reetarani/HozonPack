import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import TestimonialModal from "../../components/modals/TestimonialModal";
import api from "../../services/api";

import "./Testimonial.css";

function Testimonials() {

    const emptyForm = {
        name: "",
        designation: "",
        company: "",
        message: "",
        image: null,
        imageUrl: "",
        removeImage: false,
        isActive: true,
    };

    const [testimonials, setTestimonials] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [formData, setFormData] =
        useState(emptyForm);

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


    // =========================
    // ADD
    // =========================

    const handleAdd = () => {

        setFormData({
            ...emptyForm,
        });

        setErrors({});

        setIsFormOpen(true);
    };


    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        const {
            name,
            value,
            files,
            type,
        } = e.target;


        // IMAGE
        if (type === "file") {

            const file =
                files?.[0] || null;

            setFormData((prev) => ({
                ...prev,

                image: file,

                // If new image selected,
                // cancel remove flag
                removeImage: false,
            }));

        }

        // NORMAL INPUT
        else {

            setFormData((prev) => ({
                ...prev,

                [name]: value,
            }));
        }


        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };


    // =========================
    // REMOVE IMAGE
    // =========================

    const handleRemoveImage = () => {

    setFormData((prev) => {
        console.log("Before remove:", prev);

        return {
            ...prev,
            image: null,
            removeImage: true,
        };
    });
};

    // =========================
    // LOAD TESTIMONIALS
    // =========================

    const loadTestimonials = async () => {

        try {

            const response =
                await api.get(
                    "/testimonials",
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


            setTestimonials(
                response.data
                    .testimonials || []
            );


            setTotalPages(
                response.data
                    .pagination
                    ?.totalPages || 1
            );

        }

        catch (error) {

            console.error(
                "Failed to load testimonials:",
                error
            );

        }
    };


    useEffect(() => {

        loadTestimonials();

    }, [
        page,
        search,
        status,
    ]);


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        const newErrors = {};


        if (
            !formData.name ||
            !formData.name.trim()
        ) {

            newErrors.name =
                "Name is required.";
        }


        if (
            !formData.message ||
            !formData.message.trim()
        ) {

            newErrors.message =
                "Message is required.";
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


            data.append(
                "name",
                formData.name
            );

            data.append(
                "designation",
                formData.designation || ""
            );

            data.append(
                "company",
                formData.company || ""
            );

            data.append(
                "message",
                formData.message
            );

            data.append(
                "isActive",
                String(formData.isActive)
            );


            // NEW IMAGE
            if (formData.image) {

                data.append(
                    "image",
                    formData.image
                );
            }


            // REMOVE EXISTING IMAGE
            data.append(
                "removeImage",
                formData.removeImage
                    ? "true"
                    : "false"
            );


            // =========================
            // UPDATE
            // =========================

            if (formData._id) {

                const response =
                    await api.put(
                        `/testimonials/${formData._id}`,
                        data
                    );


                const updatedTestimonial =
                    response.data.testimonial;


                setTestimonials((prev) =>
                    prev.map((item) =>
                        item._id ===
                        updatedTestimonial._id
                            ? updatedTestimonial
                            : item
                    )
                );


                setToast({
                    message:
                        "Testimonial updated successfully.",
                    type: "success",
                });

            }

            // =========================
            // CREATE
            // =========================

            else {

                const response =
                    await api.post(
                        "/testimonials",
                        data
                    );


                setTestimonials((prev) => [
                    response.data.testimonial,
                    ...prev,
                ]);


                setToast({
                    message:
                        "Testimonial created successfully.",
                    type: "success",
                });
            }


            // RESET

            setFormData({
                ...emptyForm,
            });

            setErrors({});

            setIsFormOpen(false);

        }

        catch (error) {

            console.error(
                "Failed to save testimonial:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Failed to save testimonial.";


            setToast({
                message,
                type: "error",
            });

        }

        finally {

            setIsSubmitting(false);
        }
    };


    // =========================
    // EDIT
    // =========================

    const handleEdit = async (id) => {

        try {

            const response =
                await api.get(
                    `/testimonials/${id}`
                );


            const testimonial =
                response.data.data;


            setFormData({

                _id:
                    testimonial._id,

                name:
                    testimonial.name || "",

                designation:
                    testimonial.designation || "",

                company:
                    testimonial.company || "",

                message:
                    testimonial.message || "",

                image:
                    null,

                imageUrl:
                    testimonial.image || "",

                removeImage:
                    false,

                isActive:
                    testimonial.isActive ?? true,
            });


            setErrors({});

            setIsFormOpen(true);

        }

        catch (error) {

            console.error(
                "Failed to load testimonial:",
                error
            );
        }
    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = (id) => {

        setDeleteId(id);

        setIsDeleteOpen(true);
    };


    const confirmDelete = async () => {

        try {

            await api.delete(
                `/testimonials/${deleteId}`
            );


            setTestimonials((prev) =>
                prev.filter(
                    (item) =>
                        item._id !== deleteId
                )
            );


            setIsDeleteOpen(false);

            setDeleteId(null);


            setToast({
                message:
                    "Testimonial deleted successfully.",
                type: "success",
            });

        }

        catch (error) {

            console.error(
                "Failed to delete testimonial:",
                error
            );


            setToast({
                message:
                    error.response?.data?.message ||
                    "Failed to delete testimonial.",
                type: "error",
            });
        }
    };


    // =========================
    // CLOSE MODAL
    // =========================

    const handleCloseModal = () => {

        setFormData({
            ...emptyForm,
        });

        setErrors({});

        setIsFormOpen(false);
    };


    return (

        <div className="container-fluid py-4">

            <div className="product-container">


                <PageHeader
                    title="Testimonials"
                    subtitle="Manage all Testimonials"
                    buttonText="Add Testimonial"
                    onAdd={handleAdd}
                />


                {/* TOOLBAR */}

                <div className="toolbar">

                    <input
                        className="search-input"
                        placeholder="Search testimonials..."
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


                {/* TABLE */}

                <div className="table-box">

                    <table className="product-table">

                        <thead className="table-light">

                            <tr>

                                <th>#</th>

                                <th>
                                    Image
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Designation
                                </th>

                                <th>
                                    Company
                                </th>

                                <th>
                                    Message
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

                            {testimonials.length > 0 ? (

                                testimonials.map(
                                    (
                                        testimonial,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                testimonial._id
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>


                                            <td>

                                                {testimonial.image ? (

                                                    <img
                                                        src={`http://localhost:5000${testimonial.image}`}
                                                        alt={
                                                            testimonial.name
                                                        }
                                                        width="50"
                                                        height="50"
                                                        style={{
                                                            objectFit:
                                                                "cover",
                                                            borderRadius:
                                                                "8px",
                                                        }}
                                                    />

                                                ) : (

                                                    "-"
                                                )}

                                            </td>


                                            <td>
                                                {
                                                    testimonial.name
                                                }
                                            </td>


                                            <td>
                                                {
                                                    testimonial.designation
                                                }
                                            </td>


                                            <td>
                                                {
                                                    testimonial.company ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    testimonial.message
                                                }
                                            </td>


                                            <td>

                                                {testimonial.isActive ? (

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
                                                                testimonial._id
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
                                                                testimonial._id
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
                                        colSpan="8"
                                        className="text-center py-4"
                                    >
                                        No testimonials found.
                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>


                {/* PAGINATION */}

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


                {/* TESTIMONIAL MODAL */}

                <TestimonialModal

                    isOpen={
                        isFormOpen
                    }

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

                    onSubmit={
                        handleSubmit
                    }

                    onRemoveImage={
                        handleRemoveImage
                    }

                    isSubmitting={
                        isSubmitting
                    }

                />


                {/* DELETE MODAL */}

                <ConfirmModal

                    isOpen={
                        isDeleteOpen
                    }

                    title="Delete Testimonial"

                    message="Are you sure you want to permanently delete this testimonial?"

                    onConfirm={
                        confirmDelete
                    }

                    onCancel={() => {

                        setIsDeleteOpen(
                            false
                        );

                        setDeleteId(
                            null
                        );
                    }}

                />


                {/* TOAST */}

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

export default Testimonials;