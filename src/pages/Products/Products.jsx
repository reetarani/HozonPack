import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Header from "../../components/Header/header.jsx";
import TopBar from "../../components/topbar/topbar";
import Footer from "../../components/footer/footer.jsx";
import EnquiryPopup from "../../components/EnquiryPopup/EnquiryPopup";
import ProductCard from "../../components/ProductCard/ProductCard";
import CorporateQuote from "../../components/CorporateQuote/CorporateQuote.jsx";
import { getPublicTopBar } from "../../services/topbarService";
import { getPublicProducts } from "../../services/productService";
import { getPublicCategories } from "../../services/categoryService";
import { getPublicIndustries } from "../../services/industryService";

import "./Products.css";


function Products({
    initialProducts = [],
    initialCategories = [],
    initialIndustries = [],
    initialTopBar = null,
}) {

    const [searchParams, setSearchParams] =
        useSearchParams();


    /* =========================================================
       TOP BAR
    ========================================================= */

    const [topBar, setTopBar] =
        useState(initialTopBar);


    /* =========================================================
       DATA
    ========================================================= */
    const [products, setProducts] =
    useState(initialProducts || []);

    const [categories, setCategories] =
        useState(initialCategories || []);

    const [industries, setIndustries] =
        useState(initialIndustries || []);

    const [loading, setLoading] =
        useState(false);


    /* =========================================================
       FILTERS
    ========================================================= */

    const [selectedCategories, setSelectedCategories] =
        useState([]);

    const [selectedIndustries, setSelectedIndustries] =
        useState([]);

    const [fastDelivery, setFastDelivery] = useState(false);

    /* =========================================================
       FILTER SECTIONS
    ========================================================= */

    const [openSections, setOpenSections] =
        useState({
            category: true,
            industry: true,
            delivery: false,
        });

useEffect(() => {
    const deliveryParam = searchParams.get("delivery");

    setFastDelivery(
        deliveryParam === "fast"
    );
}, [searchParams]);
    /* =========================================================
       MOBILE FILTER
    ========================================================= */

    const [mobileFiltersOpen, setMobileFiltersOpen] =
        useState(false);


    /* =========================================================
       ENQUIRY
    ========================================================= */

    const [isQuoteOpen, setIsQuoteOpen] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState("");


    /* =========================================================
       LOAD TOP BAR
       
       This is only for the Products page.
       It will not change the TopBar component.
    ========================================================= */

    useEffect(() => {

        const loadTopBar = async () => {

            try {

                const response =
                    await getPublicTopBar();

                console.log(
                    "Products page TopBar:",
                    response
                );

                if (response?.success) {

                    setTopBar(
                        response.topBar || null
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load top bar:",
                    error
                );

            }

        };


        loadTopBar();

    }, []);


    /* =========================================================
       LOAD PRODUCTS
    ========================================================= */

 useEffect(() => {
    if (initialProducts.length > 0) {
        return;
    }

    const loadProducts = async () => {
        try {
            setLoading(true);

            const response =
                await getPublicProducts();

            if (response?.success) {
                setProducts(
                    response.products || []
                );
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error(
                "Failed to load products:",
                error
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    loadProducts();
}, [initialProducts]);


    /* =========================================================
       LOAD CATEGORIES
    ========================================================= */

   useEffect(() => {
    if (initialCategories.length > 0) {
        return;
    }

    const loadCategories = async () => {
        try {
            const response =
                await getPublicCategories();

            if (response?.success) {
                setCategories(
                    response.categories || []
                );
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error(
                "Failed to load categories:",
                error
            );

            setCategories([]);
        }
    };

    loadCategories();
}, [initialCategories]);

    /* =========================================================
       LOAD INDUSTRIES
    ========================================================= */

    useEffect(() => {
    if (initialIndustries.length > 0) {
        return;
    }

    const loadIndustries = async () => {
        try {
            const response =
                await getPublicIndustries();

            if (response?.success) {
                setIndustries(
                    response.industries || []
                );
            } else {
                setIndustries([]);
            }
        } catch (error) {
            console.error(
                "Failed to load industries:",
                error
            );

            setIndustries([]);
        }
    };

    loadIndustries();
}, [initialIndustries]);


    /* =========================================================
       HELPERS
    ========================================================= */

    const getId = (value) => {

        if (!value) {
            return "";
        }


        if (typeof value === "string") {
            return value;
        }


        return value._id || "";

    };


    const getSlug = (value) => {

        if (!value) {
            return "";
        }


        if (typeof value === "string") {
            return "";
        }


        return value.slug || "";

    };


    const getName = (value) => {

        if (!value) {
            return "";
        }


        if (typeof value === "string") {
            return "";
        }


        return value.name || "";

    };


    /* =========================================================
       READ INDUSTRY FILTER FROM URL
       
       Examples:
       
       /products?industry=fmcg-industry
       
       /products?industry=fmcg-industry,food-industry
    ========================================================= */

    useEffect(() => {

        const industryParam =
            searchParams.get("industry");


        if (!industryParam) {

            setSelectedIndustries([]);

            return;

        }


        const urlIndustries =
            industryParam
                .split(",")
                .map(
                    (item) =>
                        item.trim()
                )
                .filter(Boolean);


        setSelectedIndustries(
            urlIndustries
        );

    }, [searchParams]);


    /* =========================================================
       CATEGORY SELECTION
       
       Multiple selections supported.
       
       Example:
       
       Corrugated Packaging
       +
       Paper & Board Materials
    ========================================================= */

    const handleCategoryChange = (
        categorySlug
    ) => {

        setSelectedCategories(
            (current) => {

                if (
                    current.includes(
                        categorySlug
                    )
                ) {

                    return current.filter(
                        (item) =>
                            item !==
                            categorySlug
                    );

                }


                return [
                    ...current,
                    categorySlug,
                ];

            }
        );

    };


    /* =========================================================
       INDUSTRY SELECTION
       
       Multiple selections supported.
    ========================================================= */

    const handleIndustryChange = (
        industrySlug
    ) => {

        setSelectedIndustries(
            (current) => {

                let next;


                if (
                    current.includes(
                        industrySlug
                    )
                ) {

                    next =
                        current.filter(
                            (item) =>
                                item !==
                                industrySlug
                        );

                } else {

                    next = [
                        ...current,
                        industrySlug,
                    ];

                }


                /* ---------------------------------------------
                   Update URL
                --------------------------------------------- */

                const params =
                    new URLSearchParams(
                        searchParams
                    );


                if (next.length === 0) {

                    params.delete(
                        "industry"
                    );

                } else {

                    params.set(
                        "industry",
                        next.join(",")
                    );

                }


                setSearchParams(params);


                return next;

            }
        );

    };


    /* =========================================================
       CLEAR ALL FILTERS
    ========================================================= */

    const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedIndustries([]);
    setFastDelivery(false);

    const params =
        new URLSearchParams(searchParams);

    params.delete("industry");
    params.delete("delivery");

    setSearchParams(params);
};


    /* =========================================================
       RESOLVE SELECTED CATEGORY IDS
       
       Used when product.category contains only an ID.
    ========================================================= */

    const selectedCategoryIds =
        useMemo(() => {

            return categories
                .filter(
                    (category) => {

                        const slug =
                            getSlug(
                                category
                            );

                        return selectedCategories.includes(
                            slug
                        );

                    }
                )
                .map(
                    (category) =>
                        getId(category)
                )
                .filter(Boolean);

        }, [
            categories,
            selectedCategories,
        ]);


    /* =========================================================
       RESOLVE SELECTED INDUSTRY IDS
       
       Used when product.industries contains only IDs.
    ========================================================= */

    const selectedIndustryIds =
        useMemo(() => {

            return industries
                .filter(
                    (industry) => {

                        const slug =
                            getSlug(
                                industry
                            );

                        return selectedIndustries.includes(
                            slug
                        );

                    }
                )
                .map(
                    (industry) =>
                        getId(industry)
                )
                .filter(Boolean);

        }, [
            industries,
            selectedIndustries,
        ]);


    /* =========================================================
       FILTER PRODUCTS
       
       Category:
       Multiple = OR
       
       Industry:
       Multiple = OR
       
       Between Category + Industry:
       AND
    ========================================================= */

    const filteredProducts =
        useMemo(() => {
            
            return products.filter(
                (product) => {


                    /* =========================================
                       CATEGORY FILTER
                    ========================================= */

                    if (
                        selectedCategories.length >
                        0
                    ) {

                        const productCategory =
                            product.category;


                        const productCategorySlug =
                            getSlug(
                                productCategory
                            );


                        const productCategoryId =
                            getId(
                                productCategory
                            );


                        const categoryMatch =
                            selectedCategories.some(
                                (
                                    selectedCategory
                                ) => {

                                    /*
                                     * Populated object
                                     * slug match
                                     */

                                    if (
                                        selectedCategory ===
                                        productCategorySlug
                                    ) {

                                        return true;

                                    }


                                    /*
                                     * Direct ID match
                                     */

                                    if (
                                        selectedCategory ===
                                        productCategoryId
                                    ) {

                                        return true;

                                    }


                                    /*
                                     * Selected slug
                                     * resolved to ID
                                     */

                                    if (
                                        selectedCategoryIds.includes(
                                            productCategoryId
                                        )
                                    ) {

                                        return true;

                                    }


                                    return false;

                                }
                            );


                        if (!categoryMatch) {

                            return false;

                        }

                    }


                    /* =========================================
                       INDUSTRY FILTER
                    ========================================= */

                    if (
                        selectedIndustries.length >
                        0
                    ) {

                        const productIndustries =
                            Array.isArray(
                                product.industries
                            )
                                ? product.industries
                                : [];


                        const industryMatch =
                            productIndustries.some(
                                (
                                    productIndustry
                                ) => {

                                    const productIndustrySlug =
                                        getSlug(
                                            productIndustry
                                        );


                                    const productIndustryId =
                                        getId(
                                            productIndustry
                                        );


                                    /*
                                     * Populated slug
                                     */

                                    if (
                                        selectedIndustries.includes(
                                            productIndustrySlug
                                        )
                                    ) {

                                        return true;

                                    }


                                    /*
                                     * Direct ID
                                     */

                                    if (
                                        selectedIndustries.includes(
                                            productIndustryId
                                        )
                                    ) {

                                        return true;

                                    }


                                    /*
                                     * Selected slug
                                     * converted to ID
                                     */

                                    if (
                                        selectedIndustryIds.includes(
                                            productIndustryId
                                        )
                                    ) {

                                        return true;

                                    }


                                    return false;

                                }
                            );


                        if (!industryMatch) {

                            return false;

                        }

                    }
                    if (
                        fastDelivery &&
                        product.fastDelivery !== true
                    ) {
                        return false;
                    }

                    return true;

                }
            );

        }, [
            products,
            selectedCategories,
            selectedIndustries,
            selectedCategoryIds,
            selectedIndustryIds,
            fastDelivery,
        ]);


    /* =========================================================
       FILTER SECTION TOGGLE
    ========================================================= */

    const toggleSection = (
        section
    ) => {

        setOpenSections(
            (current) => ({
                ...current,
                [section]:
                    !current[section],
            })
        );

    };


    /* =========================================================
       ENQUIRE
    ========================================================= */

    const handleEnquiry = (
        product
    ) => {

        setSelectedProduct(
            product?.name || ""
        );

        setIsQuoteOpen(true);

    };


    /* =========================================================
       CLOSE ENQUIRY
    ========================================================= */

    const closeEnquiry = () => {

        setIsQuoteOpen(false);

        setSelectedProduct("");

    };


    /* =========================================================
       ACTIVE FILTER COUNT
    ========================================================= */

    const activeFilterCount =
    selectedCategories.length +
    selectedIndustries.length +
    (fastDelivery ? 1 : 0);


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="shop-page-wrapper">


            {/* =====================================================
                TOP BAR
            ===================================================== */}

            <TopBar
                initialTopBar={topBar}
            />


            {/* =====================================================
                HEADER
            ===================================================== */}

            <Header
                onGetQuote={() =>
                    setIsQuoteOpen(true)
                }
            />


            {/* =====================================================
                SHOP PAGE
            ===================================================== */}

            <main className="shop-page">

                <div className="container">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="shop-page-header">

                        <div className="shop-page-heading">

                            <span className="shop-eyebrow">
                                Our Products
                            </span>

                            <h1>
                                Packaging{" "}
                                <span>
                                    Solutions
                                </span>
                            </h1>

                            <p>
                                Explore our range of
                                premium packaging
                                solutions designed
                                for different
                                industries and
                                applications.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        MOBILE FILTER TOOLBAR
                    ================================================= */}

                    <div className="shop-mobile-toolbar">

                        <button
                            type="button"
                            className="shop-mobile-filter-btn"
                            onClick={() =>
                                setMobileFiltersOpen(
                                    true
                                )
                            }
                        >

                            <span>
                                Filters
                            </span>

                            {activeFilterCount >
                                0 && (

                                <span className="filter-count">
                                    {
                                        activeFilterCount
                                    }
                                </span>

                            )}

                        </button>


                        <span className="mobile-product-count">

                            All Products [
                            {
                                filteredProducts.length
                            }{" "}
                            items]

                        </span>

                    </div>


                    {/* =================================================
                        LAYOUT
                    ================================================= */}

                    <div className="shop-layout">


                        {/* =================================================
                            FILTER SIDEBAR
                        ================================================= */}

                        <aside
                            className={`
                                shop-sidebar
                                ${
                                    mobileFiltersOpen
                                        ? "is-mobile-open"
                                        : ""
                                }
                            `}
                        >


                            {/* Mobile filter header */}

                            <div className="mobile-filter-header">

                                <h3>
                                    Filters
                                </h3>

                                <button
                                    type="button"
                                    className="mobile-filter-close"
                                    onClick={() =>
                                        setMobileFiltersOpen(
                                            false
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            {/* Filter heading */}

                            <div className="filter-top">

                                <div>

                                    <span>
                                        Filter By
                                    </span>

                                    {activeFilterCount >
                                        0 && (

                                        <small>
                                            {
                                                activeFilterCount
                                            }{" "}
                                            selected
                                        </small>

                                    )}

                                </div>


                                {activeFilterCount >
                                    0 && (

                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                    >
                                        Clear All
                                    </button>

                                )}

                            </div>


                            {/* =================================================
                                CATEGORY
                            ================================================= */}

                            <div className="filter-section">

                                <button
                                    type="button"
                                    className="filter-section-title"
                                    onClick={() =>
                                        toggleSection(
                                            "category"
                                        )
                                    }
                                >

                                    <span>
                                        Category
                                    </span>

                                    <span>
                                        {
                                            openSections.category
                                                ? "−"
                                                : "+"
                                        }
                                    </span>

                                </button>


                                {openSections.category && (

                                    <div className="filter-options">

                                        {categories.length >
                                        0 ? (

                                            categories.map(
                                                (
                                                    category
                                                ) => {

                                                    const slug =
                                                        getSlug(
                                                            category
                                                        );


                                                    return (

                                                        <label
                                                            className="filter-checkbox"
                                                            key={
                                                                category._id ||
                                                                slug
                                                            }
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    selectedCategories.includes(
                                                                        slug
                                                                    )
                                                                }
                                                                onChange={() =>
                                                                    handleCategoryChange(
                                                                        slug
                                                                    )
                                                                }
                                                            />

                                                            <span className="custom-checkbox" />

                                                            <span className="filter-label">
                                                                {
                                                                    category.name
                                                                }
                                                            </span>

                                                        </label>

                                                    );

                                                }
                                            )

                                        ) : (

                                            <div className="filter-empty">
                                                No categories
                                                found.
                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                INDUSTRY
                            ================================================= */}

                            <div className="filter-section">

                                <button
                                    type="button"
                                    className="filter-section-title"
                                    onClick={() =>
                                        toggleSection(
                                            "industry"
                                        )
                                    }
                                >

                                    <span>
                                        Industry
                                    </span>

                                    <span>
                                        {
                                            openSections.industry
                                                ? "−"
                                                : "+"
                                        }
                                    </span>

                                </button>


                                {openSections.industry && (

                                    <div className="filter-options">

                                        {industries.length >
                                        0 ? (

                                            industries.map(
                                                (
                                                    industry
                                                ) => {

                                                    const slug =
                                                        getSlug(
                                                            industry
                                                        );


                                                    return (

                                                        <label
                                                            className="filter-checkbox"
                                                            key={
                                                                industry._id ||
                                                                slug
                                                            }
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    selectedIndustries.includes(
                                                                        slug
                                                                    )
                                                                }
                                                                onChange={() =>
                                                                    handleIndustryChange(
                                                                        slug
                                                                    )
                                                                }
                                                            />

                                                            <span className="custom-checkbox" />

                                                            <span className="filter-label">
                                                                {
                                                                    industry.name
                                                                }
                                                            </span>

                                                        </label>

                                                    );

                                                }
                                            )

                                        ) : (

                                            <div className="filter-empty">
                                                No industries
                                                found.
                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                DELIVERY TIME
                            ================================================= */}

                            <div className="filter-section">

                                <button
                                    type="button"
                                    className="filter-section-title"
                                    onClick={() =>
                                        toggleSection(
                                            "delivery"
                                        )
                                    }
                                >

                                    <span>
                                        Delivery Time
                                    </span>

                                    <span>
                                        {
                                            openSections.delivery
                                                ? "−"
                                                : "+"
                                        }
                                    </span>

                                </button>


                                {openSections.delivery && (

                                    <div className="filter-options">

                                        {openSections.delivery && (
    <div className="filter-options">

        <label className="filter-checkbox">
            <input
                type="checkbox"
                checked={fastDelivery}
                onChange={(e) =>
                    setFastDelivery(
                        e.target.checked
                    )
                }
            />

            <span className="custom-checkbox" />

            <span className="filter-label">
                Fast Delivery – 24 Hours
            </span>
        </label>

    </div>
)}

                                    </div>

                                )}

                            </div>


                            {/* Mobile apply */}

                            <button
                                type="button"
                                className="mobile-filter-apply"
                                onClick={() =>
                                    setMobileFiltersOpen(
                                        false
                                    )
                                }
                            >
                                View{" "}
                                {
                                    filteredProducts.length
                                }{" "}
                                Products
                            </button>

                        </aside>


                        {/* =================================================
                            MOBILE OVERLAY
                        ================================================= */}

                        {mobileFiltersOpen && (

                            <div
                                className="shop-filter-overlay"
                                onClick={() =>
                                    setMobileFiltersOpen(
                                        false
                                    )
                                }
                            />

                        )}


                        {/* =================================================
                            PRODUCTS
                        ================================================= */}

                        <section className="shop-products-area">


                            {/* Product heading */}

                            <div className="shop-products-toolbar">

                                <div>

                                    <h2>
                                        All Products [
                                        {
                                            filteredProducts.length
                                        }{" "}
                                        items]
                                    </h2>

                                </div>


                                {activeFilterCount >
                                    0 && (

                                    <button
                                        type="button"
                                        className="desktop-clear-filter"
                                        onClick={
                                            clearFilters
                                        }
                                    >
                                        Clear Filters
                                    </button>

                                )}

                            </div>


                            {/* =================================================
                                EXISTING PRODUCT CARD
                            ================================================= */}

                            {filteredProducts.length >
                            0 ? (

                                <div className="shop-product-grid">

                                    {filteredProducts.map(
                                        (
                                            product
                                        ) => (

                                            <ProductCard
                                                key={
                                                    product._id
                                                }

                                                name={
                                                    product.name
                                                }

                                                slug={
                                                    product.slug
                                                }

                                                description={
                                                    product.description
                                                }

                                                moq={
                                                    product.moq
                                                }

                                                image={
                                                    product.image
                                                }

                                                moqUnit={
                                                    product.moqUnit || "pcs"
                                                }

                                                onEnquire={
                                                    handleEnquiry
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="shop-no-results">

                                    <div className="shop-no-results-icon">
                                        🔍
                                    </div>

                                    <h3>
                                        {loading
                                            ? "Loading products..."
                                            : "No products found"}
                                    </h3>

                                    {!loading && (
                                        <>
                                            <p>
                                                Try changing
                                                or clearing
                                                your filters.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    clearFilters
                                                }
                                            >
                                                Clear Filters
                                            </button>
                                        </>
                                    )}

                                </div>

                            )}

                        </section>

                    </div>

                </div>

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}
            <CorporateQuote />
            <Footer />


            {/* =====================================================
                ENQUIRY POPUP
            ===================================================== */}

            <EnquiryPopup
                isOpen={
                    isQuoteOpen
                }

                selectedProduct={
                    selectedProduct
                }

                showProduct={
                    Boolean(
                        selectedProduct
                    )
                }

                onClose={
                    closeEnquiry
                }
            />

        </div>
    );
}


export default Products;