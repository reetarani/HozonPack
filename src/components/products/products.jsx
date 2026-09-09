import { useEffect, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";
import SectionHeader from "../SectionHeader/SectionHeader";
import EnquiryPopup from "../EnquiryPopup/EnquiryPopup";

import { getPublicProducts } from "../../services/productService";
import { getPublicCategories } from "../../services/categoryService";

import "./products.css";


function Products({
    initialProducts = [],
    initialCategories = [],
}) {

    /* ===========================
       Products & Categories
    =========================== */

    const [products, setProducts] =
        useState(initialProducts || []);

    const [categories, setCategories] =
        useState(initialCategories || []);


    /* ===========================
       Active Category
    =========================== */

    const [activeTab, setActiveTab] =
        useState("all");


    /* ===========================
       Enquiry Popup
    =========================== */

    const [isPopupOpen, setIsPopupOpen] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState("");

    const [selectedProductMOQ, setSelectedProductMOQ] =
        useState("");


    /* ===========================
       Mobile Fixed Tabs
    =========================== */

    const [tabsFixed, setTabsFixed] =
        useState(false);


    /* =====================================================
       Sync SSR Data

       SSR data is already available during the first render.
       This effect only acts as a fallback when SSR data is
       missing.
    ===================================================== */

    useEffect(() => {

        const hasProducts =
            Array.isArray(initialProducts) &&
            initialProducts.length > 0;

        const hasCategories =
            Array.isArray(initialCategories) &&
            initialCategories.length > 0;


        // If SSR already provided everything, do nothing.
        if (
            hasProducts &&
            hasCategories
        ) {
            return;
        }


        const fetchData = async () => {

            try {

                const requests = [];


                /* -----------------------------------------
                   Fetch products only if SSR didn't provide
                   them.
                ----------------------------------------- */

                if (!hasProducts) {
                    requests.push(
                        getPublicProducts()
                    );
                } else {
                    requests.push(
                        Promise.resolve(null)
                    );
                }


                /* -----------------------------------------
                   Fetch categories only if SSR didn't provide
                   them.
                ----------------------------------------- */

                if (!hasCategories) {
                    requests.push(
                        getPublicCategories()
                    );
                } else {
                    requests.push(
                        Promise.resolve(null)
                    );
                }


                const [
                    productsResponse,
                    categoriesResponse,
                ] = await Promise.all(requests);


                /* -----------------------------------------
                   Products
                ----------------------------------------- */

                if (
                    productsResponse?.success
                ) {

                    setProducts(
                        productsResponse.products || []
                    );

                }


                /* -----------------------------------------
                   Categories
                ----------------------------------------- */

                if (
                    categoriesResponse?.success
                ) {

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

    }, [
        initialProducts,
        initialCategories,
    ]);


    /* =====================================================
       Mobile Fixed Tabs
    ===================================================== */

    useEffect(() => {

        const handleScroll = () => {

            /* -----------------------------------------
               Desktop
            ----------------------------------------- */

            if (
                window.innerWidth > 767
            ) {

                setTabsFixed(false);

                return;
            }


            /* -----------------------------------------
               Find elements
            ----------------------------------------- */

            const tabsElement =
                document.getElementById(
                    "product-category-tabs"
                );

            const sectionElement =
                document.getElementById(
                    "products"
                );


            if (
                !tabsElement ||
                !sectionElement
            ) {

                return;
            }


            /* -----------------------------------------
               Header height
            ----------------------------------------- */

            const headerHeight = 70;


            /* -----------------------------------------
               Section position
            ----------------------------------------- */

            const sectionRect =
                sectionElement.getBoundingClientRect();


            const tabsRect =
                tabsElement.getBoundingClientRect();


            /* -----------------------------------------
               Original tabs position
            ----------------------------------------- */

            const tabsOriginalTop =
                tabsElement.getBoundingClientRect().top +
                window.scrollY;


            /* -----------------------------------------
               Current scroll
            ----------------------------------------- */

            const scrollTop =
                window.scrollY;


            /* -----------------------------------------
               Start fixing
            ----------------------------------------- */

            const startPoint =
                tabsOriginalTop -
                headerHeight;


            /* -----------------------------------------
               Section bottom
            ----------------------------------------- */

            const sectionBottom =
                sectionRect.bottom +
                window.scrollY;


            /* -----------------------------------------
               Stop fixing
            ----------------------------------------- */

            const stopPoint =
                sectionBottom -
                tabsRect.height -
                headerHeight;


            /* -----------------------------------------
               Should fix?
            ----------------------------------------- */

            const shouldFix =
                scrollTop >= startPoint &&
                scrollTop < stopPoint;


            setTabsFixed(
                shouldFix
            );

        };


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true,
            }
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


    /* =====================================================
       Category Order
    ===================================================== */

    const categoryOrder = [
        "Corrugated Packaging",
        "Paper & Board Materials",
        "Packaging Accessories",
    ];


    /* =====================================================
       Sorted Categories
    ===================================================== */

    const sortedCategories =
        [...categories].sort(
            (a, b) => {

                const indexA =
                    categoryOrder.indexOf(
                        a.name
                    );

                const indexB =
                    categoryOrder.indexOf(
                        b.name
                    );


                /*
                 * Unknown categories
                 * go to the end.
                 */

                return (
                    (indexA === -1
                        ? 999
                        : indexA) -
                    (indexB === -1
                        ? 999
                        : indexB)
                );

            }
        );


    /* =====================================================
       Category Tabs
    ===================================================== */

    const tabs = [

        {
            id: "all",
            title: "All",
        },

        ...sortedCategories.map(
            (category) => ({

                id:
                    category._id ||
                    category.slug,

                title:
                    category.name,

            })
        ),

    ];


    /* =====================================================
       Filter Products
    ===================================================== */

    const filteredProducts =
        activeTab === "all"

            ? products

            : products.filter(
                (product) => {

                    const categoryId =
                        product.category?._id ||
                        product.category;


                    return (
                        String(categoryId) ===
                        String(activeTab)
                    );

                }
            );


    /* =====================================================
       Product Enquiry
    ===================================================== */

    const handleEnquiry =
        (product) => {

            console.log(
                "SELECTED PRODUCT:",
                product
            );

            console.log(
                "PRODUCT MOQ:",
                product.moq
            );


            setSelectedProduct(
                product.name
            );


            setSelectedProductMOQ(
                product.moq
            );


            setIsPopupOpen(
                true
            );

        };


    /* =====================================================
       Close Enquiry Popup
    ===================================================== */

    const handleClosePopup = () => {

        setIsPopupOpen(false);

        setSelectedProduct("");

        setSelectedProductMOQ("");

    };


    /* =====================================================
       Render
    ===================================================== */

    return (

        <section
            className="products-section"
            id="products"
        >

            {/* =================================================
                Section Header
            ================================================= */}

            <div className="container">

                <SectionHeader
                    title="Our"
                    highlight="Products"
                    subtitle="Explore our range of quality products."
                />

            </div>


            {/* =================================================
                Category Tabs
            ================================================= */}

            {tabsFixed && (

                <div
                    className="category-tabs-placeholder"
                />

            )}


            <div
                id="product-category-tabs"
                className={
                    `category-tabs-sticky ${
                        tabsFixed
                            ? "tabs-fixed"
                            : ""
                    }`
                }
            >

                <div className="container">

                    <div className="category-tabs">

                        {tabs.map(
                            (tab) => (

                                <button
                                    key={
                                        tab.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            tab.id
                                        )
                                    }
                                    className={
                                        activeTab ===
                                        tab.id
                                            ? "active"
                                            : ""
                                    }
                                >

                                    {
                                        tab.title
                                    }

                                </button>

                            )
                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                Products
            ================================================= */}

            <div className="container">

                {filteredProducts.length > 0 ? (

                    <div className="products-grid">

                        {filteredProducts.map(
                            (product, index) => (

                                <ProductCard
                                    key={product._id}
                                    name={product.name}
                                    slug={product.slug}
                                    description={product.description}
                                    moq={product.moq}
                                    moqUnit={product.moqUnit || "pcs"}
                                    image={product.image}
                                    onEnquire={handleEnquiry}
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


            {/* =================================================
                Enquiry Popup
            ================================================= */}

            <EnquiryPopup
                isOpen={
                    isPopupOpen
                }

                selectedProduct={
                    selectedProduct
                }

                selectedProductMOQ={
                    selectedProductMOQ
                }

                showProduct={
                    true
                }

                onClose={
                    handleClosePopup
                }
            />

        </section>

    );

}


export default Products;