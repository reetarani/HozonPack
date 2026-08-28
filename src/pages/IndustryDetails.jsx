import { useEffect, useState } from "react";
import TopBar from "../components/topbar/topBar";
import Header from "../components/Header/Header";
import EnquiryPopup from "../components/EnquiryPopup/EnquiryPopup";
import Footer from "../components/Footer/Footer";
import ProductCard from "../components/ProductCard/ProductCard";
import { useParams } from "react-router-dom";
import axios from "axios";

function IndustryDetails() {
    const { slug } = useParams();

    const [industry, setIndustry] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");

    useEffect(() => {
        const fetchIndustryData = async () => {
            try {
                // Get industry details
                const industryResponse = await axios.get(
                    `http://localhost:5000/api/public/industries/${slug}`
                );

                setIndustry(
                    industryResponse.data.industry
                );

                // Get products under this industry
                const productsResponse = await axios.get(
                    `http://localhost:5000/api/public/industries/${slug}/products`
                );

                setProducts(
                    productsResponse.data.products || []
                );
                console.log("INDUSTRY PRODUCTS:", productsResponse.data.products);
            } catch (error) {
                console.error(
                    "Failed to load industry:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchIndustryData();
    }, [slug]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!industry) {
        return <p>Industry not found.</p>;
    }

    return (
        <>
            <TopBar />

            <Header
                onGetQuote={() => {
                    setSelectedProduct("");
                    setIsQuoteOpen(true);
                }}
            />

            <section className="industry-details">
                <div className="container">

                    {industry.image && (
                        <img
                            src={`http://localhost:5000${industry.image}`}
                            alt={industry.name}
                            className="banner-bg"
                        />
                    )}

                    <h1>{industry.name}</h1>

                    {industry.subtitle && (
                        <h3>{industry.subtitle}</h3>
                    )}

                    {industry.description && (
                        <p>{industry.description}</p>
                    )}

                    {/* Products */}
                    <div className="industry-products">

                        <h2>Our Products</h2>

                        {products.length > 0 ? (
                            <div className="products-grid">

                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        name={product.name}
                                        description={product.description}
                                        image={product.image}
                                        onEnquire={(productName) => {
                                            console.log("SELECTED PRODUCT:", productName);
                                            setSelectedProduct(productName);
                                            setIsQuoteOpen(true);
                                        }}
                                    />
                                ))}

                            </div>
                        ) : (
                            <p>
                                No products available for this industry.
                            </p>
                        )}

                    </div>

                </div>
            </section>

            <EnquiryPopup
    isOpen={isQuoteOpen}
    selectedProduct={selectedProduct}
    showProduct={selectedProduct !== ""}
    onClose={() => {
        setIsQuoteOpen(false);
        setSelectedProduct("");
    }}
/>

            <Footer />
        </>
    );
}

export default IndustryDetails;