import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { FiSearch } from "react-icons/fi";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useState, useEffect } from "react";
import EnquiryPopup from "../EnquiryPopup/EnquiryPopup";

import {
    getSearchSuggestions,
} from "../../services/searchService";

function Header({ onGetQuote }) {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] =
        useState(false);

    const [showSearch, setShowSearch] =
        useState(false);

    const [isSticky, setIsSticky] =
        useState(false);

    const [search, setSearch] = useState("");

    const [suggestions, setSuggestions] =
        useState([]);

    const [showSuggestions, setShowSuggestions] =
        useState(false);
  
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
const [hasScrolled, setHasScrolled] = useState(false);

useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // At the very top
        if (currentScrollY <= 10) {
            setHasScrolled(false);
            setIsHeaderVisible(true);

            lastScrollY = currentScrollY;
            return;
        }

        // Scrolling DOWN
        if (currentScrollY > lastScrollY) {
            setHasScrolled(true);
            setIsHeaderVisible(false);
        }

        // Scrolling UP
        if (currentScrollY < lastScrollY) {
            setHasScrolled(true);
            setIsHeaderVisible(true);
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
        passive: true,
    });

    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
}, []);
    // Get search suggestions
    useEffect(() => {
        const keyword = search.trim();

        if (keyword.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response =
                    await getSearchSuggestions(
                        keyword
                    );

                if (response.success) {
                    setSuggestions(
                        response.suggestions || []
                    );

                    setShowSuggestions(
                        response.suggestions?.length > 0
                    );
                }
            } catch (error) {
                console.error(
                    "Search suggestions error:",
                    error
                );

                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const navItems = [
        {
            title: "Products",
            url: "/#products",
        },
        {
            title: "Our Clients",
            url: "/#clients",
        },
        {
            title: "Get a Quote",
            action: "quote",
        },
        
        {
            title: "Contact",
            url: "/#contact",
        },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setShowSearch(false);
        setShowSuggestions(false);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        setIsMenuOpen(false);
    };

    const handleSearch = () => {
        const keyword = search.trim();

        if (!keyword) return;

        setShowSuggestions(false);
        setShowSearch(false);

        navigate(
            `/search?q=${encodeURIComponent(keyword)}`
        );
    };

    const handleSuggestionClick = (item) => {
        setSearch(item.text);
        setShowSuggestions(false);
        setShowSearch(false);

        navigate(
            `/search?q=${encodeURIComponent(
                item.text
            )}`
        );
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }

        if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };
    
    return (
        <header
    className={`header ${
        isHeaderVisible
            ? "header-visible"
            : "header-hidden"
    } ${
        hasScrolled
            ? "header-scrolled"
            : "header-at-top"
    }`}
>

    <div className="container">

        {/* Logo */}
        <div className="logo">
            <Link
                to="/"
                onClick={() =>
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    })
                }
            >
                <img
                    src={logo}
                    alt="Logo"
                    width="100"
                />
            </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav">
          {navItems.map((item) =>
              item.action === "quote" ? (
                  <button
                      key={item.title}
                      type="button"
                      className="nav-quote-btn"
                      onClick={onGetQuote}
                  >
                      {item.title}
                  </button>
              ) : (
                  <a
                      key={item.title}
                      href={item.url}
                  >
                      {item.title}
                  </a>
              )
          )}
      </nav>

        {/* Desktop Search */}
        <div className="search">

            <FiSearch
                className="search-icon"
                onClick={handleSearch}
            />

            <input
                type="text"
                placeholder="Search products by names, needs, categories..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                    if (suggestions.length > 0) {
                        setShowSuggestions(true);
                    }
                }}
            />

            {showSuggestions &&
                suggestions.length > 0 && (
                    <div className="search-suggestions">

                        {suggestions.map(
                            (item, index) => (
                                <button
                                    key={`${item.type}-${item.id || item.text}-${index}`}
                                    type="button"
                                    className="search-suggestion"
                                    onClick={() =>
                                        handleSuggestionClick(
                                            item
                                        )
                                    }
                                >
                                    <span className="suggestion-icon">
                                        {item.type ===
                                            "product" && "📦"}

                                        {item.type ===
                                            "category" && "🏷️"}

                                        {item.type ===
                                            "industry" && "🏭"}

                                        {item.type ===
                                            "keyword" && "🔍"}
                                    </span>

                                    <span>
                                        {item.text}
                                    </span>
                                </button>
                            )
                        )}

                    </div>
                )}

        </div>

        {/* Mobile Icons */}
        <div className="mobile-actions">

            <div
                className="menu-toggle"
                onClick={toggleMenu}
            >
                {isMenuOpen ? (
                    <HiOutlineX />
                ) : (
                    <HiOutlineMenu />
                )}
            </div>

        </div>
    </div>


    {/* Mobile Search */}
<div className="mobile-search">

    <FiSearch
        className="mobile-search-icon"
        onClick={handleSearch}
    />

    <input
        type="text"
        placeholder="Search products by names, needs, categories..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
        onKeyDown={handleSearchKeyDown}
    />

    {showSuggestions &&
        suggestions.length > 0 && (
                <div className="search-suggestions mobile-suggestions">

                    {suggestions.map(
                        (item, index) => (
                            <button
                                key={`${item.type}-${item.id || item.text}-${index}`}
                                type="button"
                                className="search-suggestion"
                                onClick={() =>
                                    handleSuggestionClick(
                                        item
                                    )
                                }
                            >
                                <span className="suggestion-icon">
                                    {item.type ===
                                        "product" && "📦"}

                                    {item.type ===
                                        "category" && "🏷️"}

                                    {item.type ===
                                        "industry" && "🏭"}

                                    {item.type ===
                                        "keyword" && "🔍"}
                                </span>

                                <span>
                                    {item.text}
                                </span>
                            </button>
                        )
                    )}

                </div>
            )}

    </div>


    {/* Menu Overlay */}
    <div
        className={`menu-overlay ${
            isMenuOpen ? "show" : ""
        }`}
        onClick={() => setIsMenuOpen(false)}
    />


    {/* Mobile Menu */}
    <nav
        className={`mobile-nav ${
            isMenuOpen ? "open" : ""
        }`}
    >

        <div className="mobile-menu-header">

            <h3>Menu</h3>

            <button
                type="button"
                className="mobile-menu-close"
                onClick={() =>
                    setIsMenuOpen(false)
                }
            >
                <HiOutlineX />
            </button>

        </div>

        {navItems.map((item) =>
          item.action === "quote" ? (
              <button
                  key={item.title}
                  type="button"
                  className="mobile-nav-quote"
                  onClick={() => {
                      setIsMenuOpen(false);
                      onGetQuote();
                  }}
              >
                  <span>{item.title}</span>
                  <span className="arrow">›</span>
              </button>
          ) : (
              <a
                  key={item.title}
                  href={item.url}
                  onClick={() =>
                      setIsMenuOpen(false)
                  }
              >
                  <span>{item.title}</span>
                  <span className="arrow">›</span>
              </a>
          )
      )}

    </nav>
</header>
    );
}

export default Header;