import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { resetRedirect } from "@/services/redirectSlice";

export default function DefaultLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const token = Cookies.get("authToken");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      const dispatch = useDispatch();
      const navigate = useNavigate();
      const shouldRedirect = useSelector((state) => state.redirect.shouldRedirect);
    
      useEffect(() => {
        if (shouldRedirect) {
          // Redirect to login page
          Cookies.remove('authToken', { path: '' });
          navigate('/login');
          setTimeout(() => { dispatch(resetRedirect()); }, 500); // Reset the redirect state after redirecting
        }
      }, [shouldRedirect, navigate, dispatch]);
  
    
    return (
        <>
            <div className="flex bg-gray-100 min-h-screen">

                <Sidebar sidebarOpen={sidebarOpen} />

                <div className="flex-grow text-gray-800">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <Outlet />
                </div>

            </div>
        </>
    )
}