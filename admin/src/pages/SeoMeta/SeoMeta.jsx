import { useEffect, useState } from "react";
import {
    FaEdit,
    FaTrash,
} from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import SeoMetaModal from "../../components/modals/SeoMetaModal";

import {
    getSeoMeta,
    deleteSeoMeta,
    permanentlyDeleteSeoMeta,
} from "../../services/seoMetaService";

import "./SeoMeta.css";

function SeoMeta() {
    const [seoMeta, setSeoMeta] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [active, setActive] =
        useState("true");

    const [sort, setSort] =
        useState("newest");

    const [page, setPage] =
        useState(1);

    const [limit] = useState(10);

    const [totalPages, setTotalPages] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [selectedSeo, setSelectedSeo] =
        useState(null);

    const [confirmDelete, setConfirmDelete] =
        useState({
            isOpen: false,
            seo: null,
        });

    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });

    const loadSeoMeta = async () => {
        try {
            setLoading(true);

            const params = {
                page,
                limit,
                sort,
            };

            if (search.trim()) {
                params.search =
                    search.trim();
            }

            if (active) {
                params.active = active;
            }

            const response =
                await getSeoMeta(params);

            setSeoMeta(
                response.seoMeta || []
            );

            setTotalPages(
                response.totalPages || 1
            );

            setTotal(
                response.total || 0
            );

        } catch (error) {
            console.error(
                "Failed to load SEO meta:",
                error
            );

            setToast({
                message:
                    "Failed to load SEO meta",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadSeoMeta();
        }, 400);

        return () => clearTimeout(timer);
    }, [
        search,
        active,
        sort,
        page,
    ]);

    useEffect(() => {
        setPage(1);
    }, [
        search,
        active,
        sort,
    ]);

    const handleAdd = () => {
        setSelectedSeo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedSeo(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item) => {
        setConfirmDelete({
            isOpen: true,
            seo: item,
        });
    };

    const handleConfirmDelete =
        async () => {
            const item =
                confirmDelete.seo;

            if (!item) {
                return;
            }

            try {
                if (item.isActive) {
                    await deleteSeoMeta(
                        item._id
                    );
                } else {
                    await permanentlyDeleteSeoMeta(
                        item._id
                    );
                }

                setConfirmDelete({
                    isOpen: false,
                    seo: null,
                });

                await loadSeoMeta();

                setToast({
                    message: item.isActive
                        ? "SEO meta moved to inactive successfully."
                        : "SEO meta permanently deleted successfully.",
                    type: "success",
                });

            } catch (error) {
                console.error(
                    "Delete SEO meta error:",
                    error
                );

                setToast({
                    message:
                        error.response?.data
                            ?.message ||
                        "Failed to delete SEO meta",
                    type: "error",
                });
            }
        };

    const handleModalSuccess =
        async () => {
            setIsModalOpen(false);
            setSelectedSeo(null);

            await loadSeoMeta();

            setToast({
                message:
                    "SEO meta saved successfully.",
                type: "success",
            });
        };

    return (
        <div className="container-fluid py-4 seo-page">

            <div className="product-container">

                <PageHeader
                    title="SEO Meta"
                    subtitle="Manage page SEO title, keywords and description"
                    showButton={true}
                    buttonText="Add SEO Meta"
                    onAdd={handleAdd}
                />

                <div className="toolbar">

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search SEO pages..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <select
                        className="status-select"
                        value={active}
                        onChange={(e) =>
                            setActive(
                                e.target.value
                            )
                        }
                    >
                        <option value="true">
                            Active
                        </option>

                        <option value="false">
                            Inactive
                        </option>

                        <option value="">
                            All
                        </option>
                    </select>

                    <select
                        className="status-select"
                        value={sort}
                        onChange={(e) =>
                            setSort(
                                e.target.value
                            )
                        }
                    >
                        <option value="newest">
                            Newest First
                        </option>

                        <option value="oldest">
                            Oldest First
                        </option>

                        <option value="az">
                            A - Z
                        </option>

                        <option value="za">
                            Z - A
                        </option>
                    </select>

                </div>

                <div className="seo-summary">
                    <span>
                        Total SEO Pages:{" "}
                        <strong>
                            {total}
                        </strong>
                    </span>
                </div>

                <div className="table-box">

                    <table className="product-table">

                        <thead className="table-light">

                            <tr>
                                <th>#</th>
                                <th>Page</th>
                                <th>Slug</th>
                                <th>Meta Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th className="text-center">
                                    Actions
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-4"
                                    >
                                        Loading SEO meta...
                                    </td>
                                </tr>

                            ) : seoMeta.length > 0 ? (

                                seoMeta.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item._id
                                            }
                                        >

                                            <td>
                                                {(page -
                                                    1) *
                                                    limit +
                                                    index +
                                                    1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        item.page
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    item.slug
                                                }
                                            </td>

                                            <td>
                                                <div className="seo-table-title">
                                                    {
                                                        item.metaTitle ||
                                                        "-"
                                                    }
                                                </div>
                                            </td>

                                            <td>
                                                <div className="seo-table-description">
                                                    {
                                                        item.metaDescription ||
                                                        "-"
                                                    }
                                                </div>
                                            </td>

                                            <td>
                                                {item.isActive ? (
                                                    <span className="badge bg-success">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-secondary">
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
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        title={
                                                            item.isActive
                                                                ? "Deactivate"
                                                                : "Permanently Delete"
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                item
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
                                        No SEO meta found.
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

            </div>

            <SeoMetaModal
                isOpen={isModalOpen}
                seoMeta={selectedSeo}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSeo(null);
                }}
                onSuccess={
                    handleModalSuccess
                }
            />

            <ConfirmModal
                isOpen={
                    confirmDelete.isOpen
                }

                title={
                    confirmDelete.seo
                        ?.isActive
                        ? "Deactivate SEO Meta"
                        : "Permanently Delete SEO Meta"
                }

                message={
                    confirmDelete.seo
                        ?.isActive
                        ? `Are you sure you want to deactivate SEO meta for "${confirmDelete.seo?.page}"?`
                        : `Are you sure you want to permanently delete SEO meta for "${confirmDelete.seo?.page}"? This action cannot be undone.`
                }

                confirmText={
                    confirmDelete.seo
                        ?.isActive
                        ? "Deactivate"
                        : "Delete Permanently"
                }

                cancelText="Cancel"

                variant="danger"

                onConfirm={
                    handleConfirmDelete
                }

                onCancel={() =>
                    setConfirmDelete({
                        isOpen: false,
                        seo: null,
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

export default SeoMeta;