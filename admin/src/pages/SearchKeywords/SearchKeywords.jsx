import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";

import {
    getSearchKeywords,
    deleteSearchKeyword,
    permanentlyDeleteSearchKeyword,
} from "../../services/searchKeywordService";

import "./SearchKeywords.css";

function SearchKeywords() {
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [active, setActive] = useState("true");
    const [sort, setSort] = useState("popular");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalKeywords, setTotalKeywords] =
        useState(0);

    const [confirmDelete, setConfirmDelete] =
        useState({
            isOpen: false,
            keyword: null,
        });

    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });

    // Load keywords
    const loadKeywords = async () => {
        try {
            setLoading(true);

            const params = {
                page,
                limit,
                sort,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (active) {
                params.active = active;
            }

            const response =
                await getSearchKeywords(params);

            setKeywords(
                response.keywords || []
            );

            setTotalPages(
                response.totalPages || 1
            );

            setTotalKeywords(
                response.total || 0
            );

        } catch (error) {
            console.error(
                "Failed to load search keywords:",
                error
            );

            setToast({
                message:
                    "Failed to load search keywords",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadKeywords();
        }, 400);

        return () => clearTimeout(timer);
    }, [
        search,
        active,
        page,
        sort,
    ]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [
        search,
        active,
        sort,
    ]);

    // Delete confirmation
    const handleDelete = (keyword) => {
        setConfirmDelete({
            isOpen: true,
            keyword,
        });
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        const keyword =
            confirmDelete.keyword;

        if (!keyword) {
            return;
        }

        try {
            if (keyword.isActive) {
                await deleteSearchKeyword(
                    keyword._id
                );
            } else {
                await permanentlyDeleteSearchKeyword(
                    keyword._id
                );
            }

            setConfirmDelete({
                isOpen: false,
                keyword: null,
            });

            await loadKeywords();

            setToast({
                message:
                    keyword.isActive
                        ? "Keyword moved to inactive successfully."
                        : "Keyword permanently deleted successfully.",
                type: "success",
            });

        } catch (error) {
            console.error(
                "Failed to delete search keyword:",
                error
            );

            setToast({
                message:
                    error.response?.data
                        ?.message ||
                    "Failed to delete keyword",
                type: "error",
            });
        }
    };

    return (
        <div className="container-fluid py-4 search-keywords-page">

            <div className="product-container">

                <PageHeader
                    title="Search Keywords"
                    subtitle="Manage website search keywords"
                    showButton={false}
                />

                {/* Toolbar */}
                <div className="toolbar">

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search keywords..."
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
                        <option value="popular">
                            Most Searched
                        </option>

                        <option value="newest">
                            Recently Searched
                        </option>

                        <option value="oldest">
                            Oldest Searched
                        </option>

                        <option value="az">
                            A - Z
                        </option>

                        <option value="za">
                            Z - A
                        </option>
                    </select>

                </div>

                {/* Summary */}
                <div className="keyword-summary">
                    <span>
                        Total Keywords:{" "}
                        <strong>
                            {totalKeywords}
                        </strong>
                    </span>
                </div>

                {/* Table */}
                <div className="table-box">

                    <table className="product-table">

                        <thead className="table-light">

                            <tr>
                                <th>#</th>
                                <th>Keyword</th>
                                <th>Searches</th>
                                <th>Last Searched</th>
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
                                        colSpan="6"
                                        className="text-center py-4"
                                    >
                                        Loading search
                                        keywords...
                                    </td>
                                </tr>

                            ) : keywords.length > 0 ? (

                                keywords.map(
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
                                                        item.keyword
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="search-count">
                                                    {
                                                        item.count
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {item.lastSearchedAt
                                                    ? new Date(
                                                          item.lastSearchedAt
                                                      ).toLocaleDateString()
                                                    : "-"}
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
                                                        className="action-btn delete-btn"
                                                        title={
                                                            item.isActive
                                                                ? "Move to Inactive"
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
                                        colSpan="6"
                                        className="text-center py-4"
                                    >
                                        No search
                                        keywords found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Pagination */}
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

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={
                    confirmDelete.isOpen
                }

                title={
                    confirmDelete.keyword
                        ?.isActive
                        ? "Deactivate Search Keyword"
                        : "Permanently Delete Search Keyword"
                }

                message={
                    confirmDelete.keyword
                        ?.isActive
                        ? `Are you sure you want to deactivate "${confirmDelete.keyword?.keyword}"?`
                        : `Are you sure you want to permanently delete "${confirmDelete.keyword?.keyword}"? This action cannot be undone.`
                }

                confirmText={
                    confirmDelete.keyword
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
                        keyword: null,
                    })
                }
            />

            {/* Toast */}
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

export default SearchKeywords;