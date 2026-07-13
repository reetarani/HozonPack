import "./header.css";
import logo from "../../assets/images/logo.png";
import { FiSearch } from "react-icons/fi";

function Header() {
  return (
    <header className="header">
    <div className="container">
        {/* Logo */}
        <div className="logo">
        <img src={logo} alt="Hozon Logo" />
        </div>
        {/* Navigation */}
        <nav className="nav">
        <a href="/">Products</a>
        <a href="/">Our Clients</a>
        <a href="/">Get a Quote</a>
        <a href="/">Contact</a>
        </nav>
        {/* Search */}
        <div className="search">
            <FiSearch className="search-icon" />

            <input
                type="text"
                placeholder="Search products by names, needs, categories..."
            />
        </div>

    </div>
    </header>
  );
}

export default Header;