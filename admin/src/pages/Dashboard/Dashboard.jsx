import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import EnquiryViewModal from "../../components/modals/EnquiryViewModal";

import {
    FaEnvelope,
    FaEnvelopeOpen,
    FaBox,
    FaTags,
    FaIndustry,
} from "react-icons/fa";
import {
    getDashboardStats,
} from "../../services/dashboardService";

import "./Dashboard.css";

import {
    getEnquiry,
    markEnquiryAsRead,
} from "../../services/enquiryService";
function Dashboard() {
const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEnquiries: 0,
        newEnquiries: 0,
        readEnquiries: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalIndustries: 0,
    });

    const [recentEnquiries, setRecentEnquiries] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [viewEnquiry, setViewEnquiry] =
    useState(null);

    const [isViewOpen, setIsViewOpen] =
        useState(false);
    useEffect(() => {
        loadStats();
    }, []);


    const loadStats = async () => {

        try {

            setLoading(true);

            const response =
                await getDashboardStats();

            console.log(
                "Dashboard stats:",
                response
            );


            setStats(
                response.stats || {
                    totalEnquiries: 0,
                    newEnquiries: 0,
                    readEnquiries: 0,
                    totalProducts: 0,
                    totalCategories: 0,
                    totalIndustries: 0,
                }
            );


            setRecentEnquiries(
                response.recentEnquiries || []
            );


        } catch (error) {

            console.error(
                "Failed to load dashboard stats:",
                error
            );

        } finally {

            setLoading(false);

        }

    };
    const handleView = async (id) => {
        try {
            console.log("VIEW ENQUIRY ID:", id);

            const response = await getEnquiry(id);

            const enquiry = response?.enquiry;

            if (!enquiry) {
                throw new Error(
                    "Enquiry data not found"
                );
            }

            // Mark as read
            if (enquiry.status === "new") {
                const readResponse =
                    await markEnquiryAsRead(id);

                if (readResponse?.enquiry) {
                    enquiry.status =
                        readResponse.enquiry.status;
                }
            }

            setViewEnquiry(enquiry);
            setIsViewOpen(true);

            // Update dashboard row status
            setRecentEnquiries((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? {
                            ...item,
                            status: "read",
                        }
                        : item
                )
            );

        } catch (error) {
            console.error(
                "Failed to load enquiry:",
                error
            );
        }
    };
    return (
        <div className="container-fluid py-4 product-page">
            <div className="product-container">

                <div className="page-header">
                        <PageHeader
                            title="Dashboard"
                            showButton={false}
                        />
                </div>
                <div className="dashboard-stats">

                    <StatCard
                        title="Total Enquiries"
                        value={
                            loading
                                ? "..."
                                : stats.totalEnquiries
                        }
                        description="Active enquiries"
                        icon={<FaEnvelope />}
                        onClick={() => navigate("/enquiries")}
                    />

                    <StatCard
                        title="New Enquiries"
                        value={
                            loading
                                ? "..."
                                : stats.newEnquiries
                        }
                        description="Awaiting review"
                        icon={<FaEnvelope />}
                        onClick={() =>
                            navigate("/enquiries?status=new")
                        }
                    />

                    <StatCard
                        title="Read Enquiries"
                        value={
                            loading
                                ? "..."
                                : stats.readEnquiries
                        }
                        description="Already reviewed"
                        icon={<FaEnvelopeOpen />}
                        onClick={() =>
                            navigate("/enquiries?status=read")
                        }
                    />
                    <StatCard
                        title="Products"
                        value={loading ? "..." : stats.totalProducts}
                        description="Active products"
                        icon={<FaBox />}
                        onClick={() => navigate("/products?active=true")}
                    />

                    <StatCard
                        title="Categories"
                        value={
                            loading
                                ? "..."
                                : stats.totalCategories
                        }
                        description="Active categories"
                        icon={<FaTags />}
                        onClick={() =>
                            navigate("/categories?status=active")
                        }
                    />

                    <StatCard
                        title="Industries"
                        value={loading ? "..." : stats.totalIndustries}
                        description="Active industries"
                        icon={<FaIndustry />}
                        onClick={() =>
                            navigate("/industries?status=active")
                        }
                    />
                    
                </div>
                <div className="recent-enquiries">
                    <div className="section-header">
                        <h3>Recent Enquiries</h3>
                        <button
                            type="button"
                            className="view-all-btn"
                            onClick={() => navigate("/enquiries")}
                        >
                            View All →
                        </button>
                    </div>
                    

                    <div className="table-box">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentEnquiries.length > 0 ? (
                                    recentEnquiries.map((enquiry) => (
                                        <tr key={enquiry._id} onClick={() =>
                                            handleView(enquiry._id)
                                        }>
                                            <td>
                                                {enquiry.name}
                                            </td>

                                            <td>
                                                {enquiry.email}
                                            </td>

                                            <td>
                                                {enquiry.subject || "-"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge ${
                                                        enquiry.status
                                                    }`}
                                                >
                                                    {enquiry.status}
                                                </span>
                                            </td>

                                            <td>
                                                {new Date(
                                                    enquiry.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >
                                            No recent enquiries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <EnquiryViewModal
                        isOpen={isViewOpen}
                        onClose={() => {
                            setIsViewOpen(false);
                            setViewEnquiry(null);
                        }}
                        enquiry={viewEnquiry}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;