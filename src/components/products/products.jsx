import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "../ProductCard/ProductCard";
import SectionHeader from "../SectionHeader/SectionHeader";
import { productCategories } from "../../data/products";
import EnquiryPopup from "../EnquiryPopup/EnquiryPopup";

import "./products.css";
function Products() {
    const [activeTab, setActiveTab] = useState("all");
    const tabs = [
        { id: "all", title: "All" },
        ...productCategories
    ];
    const products =
        activeTab === "all"
            ? productCategories.flatMap(category => category.products)
            : productCategories.find(
                category => category.id === activeTab
              )?.products || [];
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const handleEnquiry = (productName) => {
    //console.log(productName);

    setSelectedProduct(productName);
    setIsPopupOpen(true);
};
    return (
        <section className="products" id="products">
            <div className="container">
                <SectionHeader
                title="Our Products by"
                highlight="Range"
                subtitle="Tailored packaging solutions for every sector"
                />
                <div className="category-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={activeTab === tab.id ? "active" : ""}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
                <div className="products-grid desktop-grid">
                    {products.map((product, index) => (
                        <ProductCard
                            key={`${product.id}-${index}`}
                            name={product.name}
                            description={product.description}
                            image={product.image}
                            onEnquire={handleEnquiry}
                        />
                    ))}
                </div>
                <div className="mobile-slider">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1.2}
                    >
                        {products.map((product, index) => (
                                <SwiperSlide key={`${product.id}-${index}`}>
                                <ProductCard
                                    name={product.name}
                                    description={product.description}
                                    image={product.image}
                                    onEnquire={handleEnquiry}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
            </div>
            </div>
            <EnquiryPopup
                isOpen={isPopupOpen}
                selectedProduct={selectedProduct}
                onClose={() => setIsPopupOpen(false)}
            />
        </section>
    );
}

export default Products;