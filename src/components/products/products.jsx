import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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

    // Get active products and categories
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
const categoryOrder = [
    "Corrugated Packaging",
    "Paper & Board Materials",
    "Packaging Accessories",
];

const sortedCategories = [...categories].sort(
    (a, b) =>
        categoryOrder.indexOf(a.name) -
        categoryOrder.indexOf(b.name)
);
    // Category tabs
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

    // Filter products
    const filteredProducts =
        activeTab === "all"
            ? products
            : products.filter((product) => {
                  const categoryId =
                      product.category?._id ||
                      product.category;

                  return categoryId === activeTab;
              });

    // Enquiry popup
    const handleEnquiry = (productName) => {
        setSelectedProduct(productName);
        setIsPopupOpen(true);
    };

    return (
        <section className="products-section" id="products">

            <div className="container">

                <SectionHeader
                    title="Our"
                    highlight="Products"
                    subtitle="Explore our range of quality products."
                />

                {/* Category Tabs */}
                <div className="category-tabs">

                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
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

                {/* Products */}
                {filteredProducts.length > 0 && (
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            576: {
                                slidesPerView: 2,
                            },
                            992: {
                                slidesPerView: 3,
                            },
                        }}
                    >
                        {filteredProducts.length > 0 && (
                            <div className="products-grid">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        name={product.name}
                                        description={product.description}
                                        image={product.image}
                                        onEnquire={handleEnquiry}
                                    />
                                ))}
                            </div>
                        )}
                    </Swiper>
                )}

                {/* No products */}
                {filteredProducts.length === 0 && (
                    <p className="text-center">
                        No products available.
                    </p>
                )}

                {/* Enquiry Popup */}
                <EnquiryPopup
                    isOpen={isPopupOpen}
                    selectedProduct={selectedProduct}
                    onClose={() =>
                        setIsPopupOpen(false)
                    }
                />

            </div>

        </section>
    );
}

export default Products;