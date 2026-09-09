import { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import EnquiryViewModal from "../../components/modals/EnquiryViewModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import {
    getAllEnquiries,
    getEnquiry,
    markEnquiryAsRead,
    deleteEnquiry,
    permanentlyDeleteEnquiry,
} from "../../services/enquiryService";

import {
    getCorporateQuote,
    markCorporateQuoteAsRead,
    deleteCorporateQuote,
    permanentlyDeleteCorporateQuote,
} from "../../services/corporateQuoteService";

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

        const response = await getAllEnquiries(params);
console.log(
    "ALL ENQUIRIES RESPONSE:",
    response
);
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
        "FAILED TO LOAD ENQUIRIES:",
        error
    );

    console.error(
        "STATUS:",
        error?.response?.status
    );

    console.error(
        "RESPONSE:",
        error?.response?.data
    );

    console.error(
        "URL:",
        error?.config?.url
    );
} finally {
    setLoading(false);
}
};
const handleView = async (enquiry) => {
    try {
        let response;
        let data;

        // Corporate Quote
        if (enquiry.type === "corporate") {
            response = await getCorporateQuote(
                enquiry._id
            );

            data = response?.quote;

            if (!data) {
                throw new Error(
                    "Corporate quote data not found"
                );
            }

            // Mark corporate quote as read
            if (data.status === "new") {
                const readResponse =
                    await markCorporateQuoteAsRead(
                        enquiry._id
                    );

                if (readResponse?.quote) {
                    data.status =
                        readResponse.quote.status;
                }
            }

        } else {
            // Normal Product Enquiry
            response = await getEnquiry(
                enquiry._id
            );

            data = response?.enquiry;

            if (!data) {
                throw new Error(
                    "Enquiry data not found"
                );
            }

            // Mark enquiry as read
            if (data.status === "new") {
                const readResponse =
                    await markEnquiryAsRead(
                        enquiry._id
                    );

                if (readResponse?.enquiry) {
                    data.status =
                        readResponse.enquiry.status;
                }
            }
        }

        // Keep type so modal knows the source
        data.type = enquiry.type;

        setViewEnquiry(data);

        // Update table immediately
        setEnquiries((prev) =>
            prev.map((item) =>
                item._id === enquiry._id &&
                item.type === enquiry.type
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
        if (enquiry.type === "corporate") {

            if (enquiry.isActive) {
                // Corporate Quote → Soft delete
                await deleteCorporateQuote(
                    enquiry._id
                );
            } else {
                // Corporate Quote → Permanent delete
                await permanentlyDeleteCorporateQuote(
                    enquiry._id
                );
            }

        } else {

            if (enquiry.isActive) {
                // Product Enquiry → Soft delete
                await deleteEnquiry(
                    enquiry._id
                );
            } else {
                // Product Enquiry → Permanent delete
                await permanentlyDeleteEnquiry(
                    enquiry._id
                );
            }
        }

        setConfirmDelete({
            isOpen: false,
            enquiry: null,
        });

        await loadEnquiries();

        setToast({
            message: "Enquiry deleted successfully.",
            type: "success",
        });

    } catch (error) {
        console.error(
            "Failed to delete enquiry:",
            error
        );

        const message =
            error?.response?.data?.message ||
            "Failed to delete enquiry.";

        setToast({
            message,
            type: "error",
        });

        console.error(
            "Server response:",
            error?.response?.data
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
                            <th>Type</th>
                            <th>Email</th>                     
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
                                    colSpan="7"
                                    className="text-center py-4"
                                >
                                    Loading enquiries...
                                </td>
                            </tr>

                        ) : enquiries.length > 0 ? (

                            enquiries.map(
                                (enquiry, index) => (
                                    <tr
                                        key={`${enquiry.type}-${enquiry._id}`}
                                    >
                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {enquiry.type === "corporate" ? (
                                                <span className="text-dark">
                                                    Corporate Quote
                                                </span>
                                            ) : (
                                                <span>
                                                    Product Enquiry
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            {enquiry.email}
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
                                                    onClick={() => handleView(enquiry)}
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
                                    colSpan="7"
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