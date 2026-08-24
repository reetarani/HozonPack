import { useNavigate, NavLink } from "react-router-dom";

import {
    FaTachometerAlt,
    FaBoxOpen,
    FaTags,
    FaIndustry,
    FaEnvelope,
    FaUser,
    FaSignOutAlt,
    FaBuilding,
    FaImage,
    FaSearch,
    FaGlobe,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
};

    return (
        <aside className="sidebar">

            <h2>Hozonpack</h2>

            <ul>

                <li>
                    <NavLink to="/">
                        <FaTachometerAlt />
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/hero">
                        <FaImage />
                        <span>Hero</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/products">
                        <FaBoxOpen />
                        <span>Products</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/categories">
                        <FaTags />
                        <span>Categories</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/industries">
                        <FaIndustry />
                        <span>Industries</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/enquiries">
                        <FaEnvelope />
                        <span>Enquiries</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/testimonial">
                        <FaEnvelope />
                        <span>Testimonials</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/clients">
                        <FaBuilding />
                        <span>Clients</span>
                    </NavLink>
                </li>
                <li>
                  <NavLink to="/search-keywords">
                    <FaSearch />
                    <span> Search Keywords</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seo-meta">
                    <FaGlobe />
                    <span> SEO Meta</span>
                  </NavLink>
                </li>
                <li>
                    <NavLink to="/users">
                        <FaUser />
                        <span>Users</span>
                    </NavLink>
                </li>
                

                <li>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="sidebar-logout"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </li>

            </ul>

        </aside>
    );
}

export default Sidebar;