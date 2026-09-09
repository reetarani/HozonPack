import { Routes, Route } from "react-router-dom";

import ScrollToHash from "./components/ScrollToHash";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsNConditions from "./pages/Terms&Conditions";
import SearchResults from "./pages/SearchResults/SearchResults";
import IndustryDetails from "./pages/IndustryDetails";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Products from "./pages/Products/Products";

function App({
    initialHero = null,
    initialProducts = [],
    initialCategories = [],
    initialIndustries = [],
    initialTopBar = null,
}) {
    return (
        <>
            <ScrollToTop />
            <ScrollToHash />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            initialHero={initialHero}
                            initialProducts={initialProducts}
                            initialCategories={initialCategories}
                            initialIndustries={initialIndustries}
                            initialTopBar={initialTopBar}
                        />
                    }
                />

                <Route
                    path="/privacy-policy"
                    element={
                        <PrivacyPolicy
                            initialTopBar={initialTopBar}
                        />
                    }
                />

                <Route
                    path="/terms-conditions"
                    element={
                        <TermsNConditions
                            initialTopBar={initialTopBar}
                        />
                    }
                />

                <Route
                    path="/search"
                    element={<SearchResults />}
                />

                <Route
                    path="/industries/:slug"
                    element={
                        <IndustryDetails
                            initialTopBar={initialTopBar}
                        />
                    }
                />
                <Route
                    path="/products"
                    element={
                        <Products
                            initialProducts={initialProducts}
                            initialCategories={initialCategories}
                            initialIndustries={initialIndustries}
                            initialTopBar={initialTopBar}
                        />
                    }
                />
                <Route
                    path="/products/:slug"
                    element={
                        <ProductDetails
                            initialTopBar={initialTopBar}
                        />
                    }
                />

            </Routes>
        </>
    );
}

export default App;