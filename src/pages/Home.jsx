import { useState } from "react";

import Header from "../components/Header/header.jsx";
import TopBar from "../components/topbar/topbar";
import Hero from "../components/hero/hero";
import Features from "../components/Features/features";
import Produtcs from "../components/products/products";
import LogoSlider from "../components/LogoSlider/LogoSlider";
import TestimonialSlider from "../components/TestimonialSlider/TestimonialSlider";
import Counter from "../components/Counter/Counter";
import Footer from "../components/footer/footer.jsx";
import Industries from "../components/Industry/Industry.jsx";
import EnquiryPopup from "../components/EnquiryPopup/EnquiryPopup";

function Home() {

    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    return (
        <>
            <TopBar />

            <Header
                onGetQuote={() => setIsQuoteOpen(true)}
            />
            

            <Hero />
            <Features />
            <Produtcs />
            <Industries />
            <LogoSlider />
            <TestimonialSlider />
            <Counter />
            <Footer />

            <EnquiryPopup
                isOpen={isQuoteOpen}
                selectedProduct=""
                showProduct={false}
                onClose={() => setIsQuoteOpen(false)}
            />
        </>
    );
}

export default Home;