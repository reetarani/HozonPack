import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

export default function Layout() {
    return (
        <div className="layout-body">
            <Sidebar />

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}