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
import CorporateQuote from "../components/CorporateQuote/CorporateQuote";
import DeliveryChallenge from "../components/DeliveryChallenge/DeliveryChallenge";


function Home({
    initialHero = null,
    initialProducts = [],
    initialCategories = [],
    initialIndustries = [],
    initialTopBar = null,
}) {

    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    return (
        <>
            <TopBar initialTopBar={initialTopBar} />

            <Header
                onGetQuote={() => setIsQuoteOpen(true)}
            />

            <Hero
                initialHero={initialHero}
            />

            <Features />
            <Industries
                initialIndustries={initialIndustries}
            />

            <Produtcs
                initialProducts={initialProducts}
                initialCategories={initialCategories}
            />
            <DeliveryChallenge />
             <TestimonialSlider />
            <LogoSlider />
           

            <Counter />
            <CorporateQuote />

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