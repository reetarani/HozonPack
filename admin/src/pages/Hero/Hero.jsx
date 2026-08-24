import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import HeroModal from "../../components/modals/HeroModal";

import api from "../../services/api";

import "./Hero.css";

function Hero() {

    const [heroes, setHeroes] = useState([]);
    const [formData, setFormData] = useState({
        badge: "",
        title: "",
        highlight: "",
        subtitle: "",
        buttonText: "",
        buttonUrl: "",
        image: null,
        imageUrl: "",
        isActive: true,
    });

    const [isFormOpen, setIsFormOpen] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errors, setErrors] = useState({});

    const [deleteId, setDeleteId] =
        useState(null);

    const [isDeleteOpen, setIsDeleteOpen] =
        useState(false);

    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });


    // Load Heroes
    const loadHeroes = async () => {

        try {

            const response =
                await api.get("/heroes");

            setHeroes(
                response.data.heroes || []
            );

        } catch (error) {

            console.error(
                "Failed to load heroes:",
                error
            );

            setToast({
                message:
                    "Failed to load heroes.",
                type: "error",
            });
        }
    };


    useEffect(() => {
        loadHeroes();
    }, []);


    // Add Hero
    const handleAdd = () => {

        setFormData({
            badge: "",
            title: "",
            highlight: "",
            subtitle: "",
            buttonText: "",
            buttonUrl: "",
            image: null,
            imageUrl: "",
            isActive: true,
        });

        setErrors({});
        setIsFormOpen(true);
    };


    // Edit Hero
    const handleEdit = async (id) => {

        try {

            const response =
                await api.get(
                    `/heroes/${id}`
                );

            const hero =
                response.data.hero;

            setFormData({
                _id: hero._id,
                badge: hero.badge || "",
                title: hero.title || "",
                highlight:
                    hero.highlight || "",
                subtitle:
                    hero.subtitle || "",
                buttonText:
                    hero.buttonText || "",
                buttonUrl:
                    hero.buttonUrl || "",
                image: null,
                imageUrl:
                    hero.image || "",
                isActive:
                    hero.isActive ?? true,
            });

            setErrors({});
            setIsFormOpen(true);

        } catch (error) {

            console.error(
                "Failed to load hero:",
                error
            );

            setToast({
                message:
                    "Failed to load hero.",
                type: "error",
            });
        }
    };


    // Form change
    const handleChange = (e) => {

        const {
            name,
            value,
            files,
            type,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "file"
                    ? files[0]
                    : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };


    // Save Hero
    const handleSubmit = async (e) => {

        e.preventDefault();

        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title =
                "Title is required.";
        }

        if (!formData.subtitle.trim()) {
            newErrors.subtitle =
                "Subtitle is required.";
        }

        if (
            !formData._id &&
            !formData.image
        ) {
            newErrors.image =
                "Hero image is required.";
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

            const data = new FormData();

            data.append(
                "badge",
                formData.badge
            );

            data.append(
                "title",
                formData.title
            );

            data.append(
                "highlight",
                formData.highlight
            );

            data.append(
                "subtitle",
                formData.subtitle
            );

            data.append(
                "buttonText",
                formData.buttonText
            );

            data.append(
                "buttonUrl",
                formData.buttonUrl
            );

            data.append(
                "isActive",
                formData.isActive
            );

            if (formData.image) {
                data.append(
                    "image",
                    formData.image
                );
            }


            let response;

            if (formData._id) {

                response = await api.put(
                    `/heroes/${formData._id}`,
                    data
                );

            } else {

                response = await api.post(
                    "/heroes",
                    data
                );
            }


            const savedHero =
                response.data.hero;


            if (formData._id) {

                setHeroes((prev) =>
                    prev.map((item) =>
                        item._id ===
                        savedHero._id
                            ? savedHero
                            : item
                    )
                );

            } else {

                setHeroes((prev) => [
                    savedHero,
                    ...prev,
                ]);
            }


            setToast({
                message: formData._id
                    ? "Hero updated successfully."
                    : "Hero created successfully.",
                type: "success",
            });

            setFormData({
                badge: "",
                title: "",
                highlight: "",
                subtitle: "",
                buttonText: "",
                buttonUrl: "",
                image: null,
                imageUrl: "",
                isActive: true,
            });

            setErrors({});
            setIsFormOpen(false);

        } catch (error) {

            console.error(
                "Failed to save hero:",
                error
            );

            setToast({
                message:
                    error.response?.data
                        ?.message ||
                    "Failed to save hero.",
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
                `/heroes/${deleteId}`
            );

            setHeroes((prev) =>
                prev.filter(
                    (item) =>
                        item._id !== deleteId
                )
            );

            setIsDeleteOpen(false);
            setDeleteId(null);

            setToast({
                message:
                    "Hero deleted successfully.",
                type: "success",
            });

        } catch (error) {

            console.error(
                "Failed to delete hero:",
                error
            );

            setToast({
                message:
                    "Failed to delete hero.",
                type: "error",
            });
        }
    };
const handleSuccess = () => {
    setIsFormOpen(false);
    loadHeroes();
};

    return (
        <div className="container-fluid py-4">

            <div className="product-container">

                <PageHeader
                    title="Hero"
                    subtitle="Manage homepage hero section"
                    buttonText="Add Hero"
                    onAdd={handleAdd}
                />


                <div className="table-box">

                    <table className="product-table">

                        <thead className="table-light">
                            <tr>

                                <th>#</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Highlight</th>
                                <th>Button</th>
                                <th>Status</th>
                                <th className="text-center">
                                    Actions
                                </th>

                            </tr>
                        </thead>


                        <tbody>

                            {heroes.length > 0 ? (

                                heroes.map(
                                    (hero, index) => (

                                        <tr
                                            key={
                                                hero._id
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>


                                            <td>

                                                {hero.image && (
                                                    <img
                                                        src={`http://localhost:5000${hero.image}`}
                                                        alt={
                                                            hero.title
                                                        }
                                                        width="80"
                                                        height="50"
                                                        style={{
                                                            objectFit:
                                                                "cover",
                                                            borderRadius:
                                                                "6px",
                                                        }}
                                                    />
                                                )}

                                            </td>


                                            <td>
                                                {hero.title}
                                            </td>


                                            <td>
                                                {hero.highlight ||
                                                    "-"}
                                            </td>


                                            <td>
                                                {hero.buttonText ||
                                                    "-"}
                                            </td>


                                            <td>

                                                {hero.isActive ? (
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
                                                                hero._id
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
                                                                hero._id
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
                                        No heroes found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {isFormOpen && (
    <HeroModal
        isOpen={isFormOpen}
        onClose={() => {
            setFormData({
                badge: "",
                title: "",
                highlight: "",
                subtitle: "",
                buttonText: "",
                buttonUrl: "",
                image: null,
                imageUrl: "",
                isActive: true,
            });

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
                    title="Delete Hero"
                    message="Are you sure you want to permanently delete this hero?"
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

export default Hero;