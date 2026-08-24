import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/Login/ForgotPassword";
import ResetPassword from "../pages/Login/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Categories from "../pages/Categories/Categories";
import Industries from "../pages/Industries/Industries";
import Enquiries from "../pages/Enquiries/Enquiries";
import Users from "../pages/Users/Users";
import Testimonials from "../pages/testimonial/Testimonial";
import Clients from "../pages/Clients/Clients";
import Hero from "../pages/Hero/Hero";
import SearchKeywords from "../pages/SearchKeywords/SearchKeywords";
import SeoMeta from "../pages/SeoMeta/SeoMeta";

function AppRoutes() {
    return (
        <Routes>

            {/* Public */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />
            <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
            />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />
                    <Route
                        path="/hero"
                        element={<Hero />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/industries"
                        element={<Industries />}
                    />

                    <Route
                        path="/enquiries"
                        element={<Enquiries />}
                    />

                    <Route
                        path="/testimonial"
                        element={<Testimonials />}
                    />
                    <Route
                        path="/clients"
                        element={<Clients />}
                    />

                    <Route
                        path="/users"
                        element={<Users />}
                    />
                    <Route 
                    path="/search-keywords"
                    element={<SearchKeywords />}
                    />
                    <Route
                        path="/seo-meta"
                        element={<SeoMeta />}
                    />
                </Route>
            </Route>

        </Routes>
    );
}

export default AppRoutes;