import "./header.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { FiSearch } from "react-icons/fi";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useState, useEffect } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [
    { title: "Products", url: "/#products" },
    { title: "Our Clients", url: "/#clients" },
    { title: "Get a Quote", url: "/#quote" },
    { title: "Contact", url: "/#contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isSticky ? "sticky" : ""}`}>
      <div className="container">

        {/* Logo */}
        <div className="logo">
          <Link to="/" 
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }>
            <img src={logo} alt="Logo" width="100" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav">
          {navItems.map((item) => (
            <a key={item.title} href={item.url}>
              {item.title}
            </a>
          ))}
        </nav>

        {/* Desktop Search */}
        <div className="search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by names, needs, categories..."
          />
        </div>

        {/* Mobile Icons */}
        <div className="mobile-actions">
          <FiSearch
            className="mobile-search-icon"
            onClick={toggleSearch}
          />

          <div className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </div>
        </div>

      </div>

      {/* Mobile Search */}
      <div className={`mobile-search ${showSearch ? "open" : ""}`}>
        <input
          type="text"
          placeholder="Search products..."
        />
      </div>
      <div
      className={`menu-overlay ${isMenuOpen ? "show" : ""}`}
      onClick={() => setIsMenuOpen(false)}> 
    </div>
      {/* Mobile Menu */}
      <nav className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
      <div className="mobile-menu-header">
        <h3>Menu</h3>
        <button
          type="button"
          className="mobile-menu-close"
          onClick={() => setIsMenuOpen(false)}
        >
          <HiOutlineX />
        </button>
      </div>

      {navItems.map((item) => (
        <a
          key={item.title}
          href={item.url}
          onClick={() => setIsMenuOpen(false)}
        >
          <span>{item.title}</span>
          <span className="arrow">›</span>
        </a>
      ))}

    </nav>
    </header>
  );
}

export default Header;