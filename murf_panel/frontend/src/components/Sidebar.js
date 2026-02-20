import React from "react";
import { NavLink, Link } from "react-router";

// DEMO VERSION - Icons removed for copy protection
let MENUS = [
    {name: "Dashboard", to: "/" },
    {name: "Export", to: "/export" },
    {name: "Employees", to: "/employees" },
    {name: "Departments", to: "/departments" },
    {name: "Account Mapping", to: "/account-mapping" },
    {name: "Source Mapping", to: "/source-mapping" },
]


export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    return (
        <>
            <aside className={`${!sidebarOpen && 'hidden'} sm:flex sm:flex-col`}>
                <a href="#" className="inline-flex items-center justify-center h-20 w-20 bg-amber-300 hover:bg-amber-500 focus:bg-amber-500">
                    {/* DEMO VERSION - Logo removed for copy protection */}
                    <span className="text-white font-bold">LOGO</span>
                </a>
                <div className="flex-grow min-h-screen flex flex-col justify-between text-gray-500 bg-gray-800">
                    <nav className="flex flex-col mx-4 my-6 space-y-4">
                        
                        {MENUS.map((menu, i)=>(
                            <NavLink key={i} to={menu.to} className={({ isActive }) =>
                                `inline-flex items-center justify-center py-3 text-amber-300 ${isActive ? 'bg-white rounded-lg' : ''}`
                              }>
                                <span>{menu.name}</span>
                            </NavLink>
                        ))}
                                               
                    </nav>

                    <div className="inline-flex items-center justify-center h-20 w-20 border-t border-gray-700">
                        <Link to={'/settings'}>
                        <button className="p-3 cursor-pointer hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
                            <span>Settings</span>
                        </button>
                        </Link>
                    </div>

                </div>
            </aside>
        </>
    )
}