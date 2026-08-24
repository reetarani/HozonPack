import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import TopBar from "../../components/topbar/topBar";
import Header from "../../components/Header/Header";

import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import EnquiryPopup from "../../components/EnquiryPopup/EnquiryPopup";

import { searchProducts } from "../../services/searchService";

import "./SearchResults.css";

function SearchResults() {
    const [searchParams] = useSearchParams();

    const keyword =
        searchParams.get("q")?.trim() || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isPopupOpen, setIsPopupOpen] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState("");

    useEffect(() => {
        const fetchResults = async () => {
            if (!keyword) {
                setProducts([]);
                return;
            }

            try {
                setLoading(true);

                const response =
                    await searchProducts(keyword);

                if (response.success) {
                    setProducts(
                        response.products || []
                    );
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error(
                    "Search results error:",
                    error
                );

                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [keyword]);

    const handleEnquiry = (productName) => {
        setSelectedProduct(productName);
        setIsPopupOpen(true);
    };

    return (
        <>
        <TopBar />
        <Header />
        <section className="search-results-section">

            <div className="container">

                <SectionHeader
                    title="Search"
                    highlight="Results"
                    subtitle={
                        keyword
                            ? `Showing results for "${keyword}"`
                            : "Search our products."
                    }
                />

                {loading && (
                    <div className="search-loading">
                        <p>
                            Searching products...
                        </p>
                    </div>
                )}

                {!loading &&
                    keyword &&
                    products.length > 0 && (
                        <>

                            <p className="search-result-count">
                                {products.length}{" "}
                                {products.length === 1
                                    ? "product"
                                    : "products"}{" "}
                                found
                            </p>

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
                                {products.map(
                                    (product) => (
                                        <SwiperSlide
                                            key={
                                                product._id
                                            }
                                        >
                                            <ProductCard
                                                name={
                                                    product.name
                                                }
                                                description={
                                                    product.description
                                                }
                                                image={
                                                    product.image
                                                }
                                                onEnquire={
                                                    handleEnquiry
                                                }
                                            />
                                        </SwiperSlide>
                                    )
                                )}
                            </Swiper>

                        </>
                    )}

                {!loading &&
                    keyword &&
                    products.length === 0 && (
                        <div className="no-search-results">

                            <h3>
                                No products found
                            </h3>

                            <p>
                                We couldn't find any
                                products matching{" "}
                                <strong>
                                    "{keyword}"
                                </strong>
                                .
                            </p>

                        </div>
                    )}

                {!keyword && (
                    <div className="no-search-results">

                        <h3>
                            Search for a product
                        </h3>

                        <p>
                            Enter a product name,
                            category, or keyword in
                            the search box.
                        </p>

                    </div>
                )}

                <EnquiryPopup
                    isOpen={isPopupOpen}
                    selectedProduct={
                        selectedProduct
                    }
                    onClose={() =>
                        setIsPopupOpen(false)
                    }
                />

            </div>

        </section>
      <Footer />    
      </>
    );
}

export default SearchResults;