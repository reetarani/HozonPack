import { useState } from "react";

import Header from "../components/Header/header.jsx";
import Footer from "../components/footer/footer.jsx";
import PageHeader from "../components/PageHeader/PageHeader.jsx";
import TopBar from "../components/topbar/topbar.jsx";
import EnquiryPopup from "../components/EnquiryPopup/EnquiryPopup";

function TermsNConditions() {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    return (
        <>
            <TopBar />

            <Header
                onGetQuote={() => setIsQuoteOpen(true)}
            />

            <section className="page">
                <div className="container">
                    <PageHeader
                        title="Terms & "
                        highlight="Conditions"
                        subtitle="Tailored packaging solutions for every sector"
                    />

                    <p>
                        The terms & conditions explains how Hozon Packaging
                        collects, uses, and protects your personal information.
                    </p>

                    <h2>Information We Collect</h2>

                    <p>
                        We may collect your name, email address, phone number,
                        and company information when you contact us.
                    </p>

                    <h2>How We Use Your Information</h2>

                    <p>
                        We use your information to respond to enquiries,
                        improve our services, and communicate with you.
                    </p>

                    <h2>Contact</h2>

                    <p>Email: info@hozonpack.com</p>
                </div>
            </section>

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

export default TermsNConditions;