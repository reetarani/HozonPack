import { Routes, Route } from "react-router-dom";
import ScrollToHash from "./components/ScrollToHash";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsNConditions from "./pages/Terms&Conditions";
import SearchResults from "./pages/SearchResults/SearchResults";
import SeoMeta from "./components/seo/SeoMeta";

function App() {
  return (
    <>
    <ScrollToTop />
    <ScrollToHash />
    {/* Dynamic SEO */}
            <SeoMeta />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsNConditions />} />
      <Route path="/search" element={<SearchResults />} />
    </Routes>
    </>
     
  );
}

export default App;