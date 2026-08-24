import { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import EnquiryViewModal from "../../components/modals/EnquiryViewModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import {
    getEnquiries,
    getEnquiry,
    markEnquiryAsRead,
    deleteEnquiry,
    permanentlyDeleteEnquiry,
} from "../../services/enquiryService";

import "./Enquiries.css";

function Enquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [viewEnquiry, setViewEnquiry] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [active, setActive] = useState("true");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEnquiries, setTotalEnquiries] = useState(0);
    const [sort, setSort] = useState("newest");
    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });

            useEffect(() => {
                const timer = setTimeout(() => {
                    loadEnquiries();
                }, 400);

                return () => clearTimeout(timer);
            }, [
                search,
                status,
                active,
                page,
                sort,
            ]);

            useEffect(() => {
                setPage(1);
            }, [
                search,
                status,
                active,
                sort,
            ]);

const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    enquiry: null,
});
    const loadEnquiries = async () => {
        
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

            if (status) {
                params.status = status;
            }

            if (active) {
                params.active = active;
            }

        const response = await getEnquiries(params);

        setEnquiries(
            response.enquiries || []
        );
        setTotalPages(
            response.totalPages || 1
        );

        setTotalEnquiries(
            response.total || 0
        );

    } catch (error) {
        console.error(
            "Failed to load enquiries:",
            error
        );
    } finally {
        setLoading(false);
    }
};
const handleView = async (id) => {
    try {
        // Get enquiry details
        const response = await getEnquiry(id);

        const enquiry = response?.enquiry;

        if (!enquiry) {
            throw new Error("Enquiry data not found");
        }

        // Mark as read if it is currently new
        if (enquiry.status === "new") {
            const readResponse =
                await markEnquiryAsRead(id);


            // Use updated enquiry returned by backend
            if (readResponse?.enquiry) {
                enquiry.status =
                    readResponse.enquiry.status;
            }
        }

        // Update selected enquiry
        setViewEnquiry(enquiry);

        // Update table immediately
        setEnquiries((prev) =>
            prev.map((item) =>
                item._id === id
                    ? {
                          ...item,
                          status: "read",
                      }
                    : item
            )
        );

        setIsViewOpen(true);

    } catch (error) {
        console.error(
            "Failed to load enquiry:",
            error
        );
    }
};
const [searchParams, setSearchParams] =
    useSearchParams();
useEffect(() => {
    const urlStatus = searchParams.get("status");

    if (urlStatus === "new" || urlStatus === "read") {
        setStatus(urlStatus);
        setPage(1);
    }
}, [searchParams]);
const handleDelete = (enquiry) => {
    setConfirmDelete({
        isOpen: true,
        enquiry,
    });
};
const handleConfirmDelete = async () => {
    const enquiry = confirmDelete.enquiry;

    if (!enquiry) {
        return;
    }

    try {
        if (enquiry.isActive) {
            // Active → Soft delete
            await deleteEnquiry(enquiry._id);

        } else {
            // Inactive → Permanent delete
            await permanentlyDeleteEnquiry(
                enquiry._id
            );
        }

        setConfirmDelete({
            isOpen: false,
            enquiry: null,
        });

        await loadEnquiries();
        setToast({
            message: "User deleted successfully.",
            type: "success",
        });

    } catch (error) {
        console.error(
            "Failed to delete enquiry:",
            error
        );
        setToast({
            message,
            type: "error",
        });
        console.error(
            "Server response:",
            error.response?.data
        );
    }
};
    return (
        <div className="container-fluid py-4 enquiry-page">
            <div className="product-container">
                <PageHeader
                    title="Enquiries"
                    subtitle="Manage contact enquiries"
                    showButton={false}
                />
            <div className="toolbar">

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search enquiries..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    className="status-select"
                    value={active}
                    onChange={(e) =>
                        setActive(e.target.value)
                    }
                >
                    <option value="true">
                        Active
                    </option>

                    <option value="false">
                        Inactive
                    </option>
                </select>
                <select
                    className="status-select"
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                </select>
                <select
                    className="status-select"
                    value={sort}
                    onChange={(e) =>
                        setSort(e.target.value)
                    }
                >
                    <option value="newest">
                        Newest First
                    </option>

                    <option value="oldest">
                        Oldest First
                    </option>
                </select>

            </div>
            <div className="enquiry-summary">
                <span>
                    Total Enquiries:{" "}
                    <strong>{totalEnquiries}</strong>
                </span>
            </div>
            <div className="table-box">

                <table className="product-table">

                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center py-4"
                                >
                                    Loading enquiries...
                                </td>
                            </tr>

                        ) : enquiries.length > 0 ? (

                            enquiries.map(
                                (enquiry, index) => (
                                    <tr
                                        key={
                                            enquiry._id
                                        }
                                    >

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {enquiry.name}
                                        </td>

                                        <td>
                                            {enquiry.email}
                                        </td>

                                        <td>
                                            {enquiry.phone ||
                                                "-"}
                                        </td>

                                        <td>
                                            {enquiry.subject ||
                                                "-"}
                                        </td>

                                        <td>
                                            {enquiry.status ===
                                            "new" ? (
                                                <span className="badge bg-warning text-dark">
                                                    New
                                                </span>
                                            ) : (
                                                <span className="badge bg-success">
                                                    Read
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            {new Date(
                                                enquiry.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="text-center">

                                            <div className="action-buttons">

                                                <button
                                                    type="button"
                                                    className="action-btn view-btn"
                                                    title="View"
                                                    onClick={() => handleView(enquiry._id)}
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-btn delete-btn"
                                                    title={
                                                        enquiry.isActive
                                                            ? "Move to Inactive"
                                                            : "Permanently Delete"
                                                    }
                                                    onClick={() => handleDelete(enquiry)}
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
                                    No enquiries found.
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
            <EnquiryViewModal
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setViewEnquiry(null);
                }}
                enquiry={viewEnquiry}
            />
            <ConfirmModal
                isOpen={confirmDelete.isOpen}

                title={
                    confirmDelete.enquiry?.isActive
                        ? "Deactivate Enquiry"
                        : "Permanently Delete Enquiry"
                }

                message={
                    confirmDelete.enquiry?.isActive
                        ? `Are you sure you want to deactivate the enquiry from "${confirmDelete.enquiry?.name}"?`
                        : `Are you sure you want to permanently delete the enquiry from "${confirmDelete.enquiry?.name}"? This action cannot be undone.`
                }

                confirmText={
                    confirmDelete.enquiry?.isActive
                        ? "Deactivate"
                        : "Delete Permanently"
                }

                cancelText="Cancel"

                variant="danger"

                onConfirm={handleConfirmDelete}

                onCancel={() =>
                    setConfirmDelete({
                        isOpen: false,
                        enquiry: null,
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

export default Enquiries;