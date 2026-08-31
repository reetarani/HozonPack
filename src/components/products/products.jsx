import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import SectionHeader from "../SectionHeader/SectionHeader";
import EnquiryPopup from "../EnquiryPopup/EnquiryPopup";

import { getPublicProducts } from "../../services/productService";
import { getPublicCategories } from "../../services/categoryService";

import "./products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedProductMOQ, setSelectedProductMOQ] = useState("");

    const [tabsFixed, setTabsFixed] = useState(false);

    /* ===========================
       Get Products & Categories
    =========================== */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    productsResponse,
                    categoriesResponse,
                ] = await Promise.all([
                    getPublicProducts(),
                    getPublicCategories(),
                ]);

                if (productsResponse.success) {
                    setProducts(
                        productsResponse.products || []
                    );
                }

                if (categoriesResponse.success) {
                    setCategories(
                        categoriesResponse.categories || []
                    );
                }

            } catch (error) {
                console.error(
                    "Failed to load products/categories:",
                    error
                );
            }
        };

        fetchData();
    }, []);


    /* ===========================
       Mobile Fixed Tabs
    =========================== */

    useEffect(() => {
    const handleScroll = () => {

        if (window.innerWidth > 767) {
            setTabsFixed(false);
            return;
        }

        const tabsElement =
            document.getElementById(
                "product-category-tabs"
            );

        const sectionElement =
            document.getElementById(
                "products"
            );

        if (!tabsElement || !sectionElement) {
            return;
        }

        const headerHeight = 70;

        const sectionRect =
            sectionElement.getBoundingClientRect();

        const tabsRect =
            tabsElement.getBoundingClientRect();

        // Where tabs normally start
        const tabsOriginalTop =
            tabsElement.getBoundingClientRect().top +
            window.scrollY;

        // Current scroll position
        const scrollTop =
            window.scrollY;

        // Start fixing
        const startPoint =
            tabsOriginalTop -
            headerHeight;

        // Section bottom in document coordinates
        const sectionBottom =
            sectionRect.bottom +
            window.scrollY;

        // Bottom point where tabs should stop
        const stopPoint =
            sectionBottom -
            tabsRect.height -
            headerHeight;

        const shouldFix =
            scrollTop >= startPoint &&
            scrollTop < stopPoint;

        setTabsFixed(shouldFix);
    };

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        handleScroll
    );

    handleScroll();

    return () => {
        window.removeEventListener(
            "scroll",
            handleScroll
        );

        window.removeEventListener(
            "resize",
            handleScroll
        );
    };
}, []);


    /* ===========================
       Category Order
    =========================== */

    const categoryOrder = [
        "Corrugated Packaging",
        "Paper & Board Materials",
        "Packaging Accessories",
    ];

    const sortedCategories =
        [...categories].sort((a, b) => {

            const indexA =
                categoryOrder.indexOf(a.name);

            const indexB =
                categoryOrder.indexOf(b.name);

            // Unknown categories go at the end
            return (
                (indexA === -1 ? 999 : indexA) -
                (indexB === -1 ? 999 : indexB)
            );
        });


    /* ===========================
       Category Tabs
    =========================== */

    const tabs = [
        {
            id: "all",
            title: "All",
        },

        ...sortedCategories.map((category) => ({
            id: category._id,
            title: category.name,
        })),
    ];


    /* ===========================
       Filter Products
    =========================== */

    const filteredProducts =
        activeTab === "all"
            ? products
            : products.filter((product) => {

                  const categoryId =
                      product.category?._id ||
                      product.category;

                  return (
                      String(categoryId) ===
                      String(activeTab)
                  );
              });


    /* ===========================
       Product Enquiry
    =========================== */

    const handleEnquiry = (product) => {
    console.log("SELECTED PRODUCT:", product);
    console.log("PRODUCT MOQ:", product.moq);

    setSelectedProduct(product.name);
    setSelectedProductMOQ(product.moq);
    setIsPopupOpen(true);
};

    /* ===========================
       Render
    =========================== */

    return (
        <section
            className="products-section"
            id="products"
        >

            {/* ===========================
                Section Header
            =========================== */}

            <div className="container">

                <SectionHeader
                    title="Our"
                    highlight="Products"
                    subtitle="Explore our range of quality products."
                />

            </div>


            {/* ===========================
                Category Tabs
            =========================== */}

            {/* Placeholder prevents layout jump */}
            {tabsFixed && (
                <div className="category-tabs-placeholder"></div>
            )}

            <div
                id="product-category-tabs"
                className={`category-tabs-sticky ${
                    tabsFixed
                        ? "tabs-fixed"
                        : ""
                }`}
            >

                <div className="container">

                    <div className="category-tabs">

                        {tabs.map((tab) => (

                            <button
                                key={tab.id}
                                type="button"
                                onClick={() =>
                                    setActiveTab(tab.id)
                                }
                                className={
                                    activeTab === tab.id
                                        ? "active"
                                        : ""
                                }
                            >
                                {tab.title}
                            </button>

                        ))}

                    </div>

                </div>

            </div>


            {/* ===========================
                Products
            =========================== */}

            <div className="container">

                {filteredProducts.length > 0 ? (

                    <div className="products-grid">

                        {filteredProducts.map(
                            (product) => (

                                <ProductCard
                                    key={product._id}
                                    name={product.name}
                                    description={product.description}
                                    image={product.image}
                                    moq={product.moq}
                                    onEnquire={() => handleEnquiry(product)}
                                />

                            )
                        )}

                    </div>

                ) : (

                    <p className="text-center">
                        No products available.
                    </p>

                )}

            </div>


            {/* ===========================
                Enquiry Popup
            =========================== */}

            <EnquiryPopup
                isOpen={isPopupOpen}
                selectedProduct={selectedProduct}
                selectedProductMOQ={selectedProductMOQ}
                showProduct={true}
                onClose={() => {
                    setIsPopupOpen(false);
                    setSelectedProduct("");
                    setSelectedProductMOQ("");
                }}
            />

        </section>
    );
}

export default Products;