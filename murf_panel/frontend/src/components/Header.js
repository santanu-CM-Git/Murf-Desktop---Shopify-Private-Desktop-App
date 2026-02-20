import React from "react";
import { RxCross1 } from "react-icons/rx";
import GlobalModal from "./GlobalModal";
import { useDispatch } from "react-redux";
import { toggle, close } from "@/services/modalSlice";
import { triggerRedirect } from "@/services/redirectSlice";
import { useGetUsersQuery } from "@/services/user";
import { setComponent } from "@/services/modalSlice";
import { NavLink, Link } from "react-router";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch()

    const handleLogout = () => { dispatch(triggerRedirect()); }
    const { data, error, isLoading } = useGetUsersQuery();

    const showModal = () => {
        dispatch(toggle())
        dispatch(setComponent({ name: 'LOG_OUT', data: null }))
    }

    return (
        <>
            <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
                <button onClick={() => { setSidebarOpen(!sidebarOpen) }} className="block sm:hidden relative flex-shrink-0 p-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 rounded-full">
                    <span className="sr-only">Menu</span>
                    {
                        !sidebarOpen ? (<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>) : <RxCross1 size={25} />
                    }

                </button>
                {/* <div className="relative w-full max-w-md sm:-ml-2">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="absolute h-6 w-6 mt-2.5 ml-2 text-gray-400">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" fill="evenodd" />
            </svg>
            <input type="text" role="search" placeholder="Search..." className="py-2 pl-10 pr-4 w-full border-4 border-transparent placeholder-gray-400 focus:bg-gray-50 rounded-lg" />
          </div> */}
                <div className="flex flex-shrink-0 items-center ml-auto">

                    {!error && <h1 className=" capitalize"><Link to={'/settings'}>{data?.data?.username ?? 'Unauthenticated'}</Link></h1>}

                    <div className="border-l pl-3 ml-3 space-x-1">
                        {/* <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
                <span className="sr-only">Notifications</span>
                <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
                <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full animate-ping"></span>
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button> */}

                        <Link to={'/settings'}>
                            <button className="p-3 cursor-pointer hover:text-gray-100 hover:bg-gray-700 rounded-lg">
                                <span className="sr-only">Settings</span>
                                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </Link>

                        <button onClick={() => showModal()} className="relative cursor-pointer p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
                            <span className="sr-only">Log out</span>
                            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>

                        {/* ******************************   Logout Modal Start   ************************************** */}
                        <GlobalModal />

                        {/* ******************************   Logout Modal End   ************************************** */}

                    </div>
                </div>
            </header>
        </>
    )
}

export default Header

const LogoutModal = () => {
    const dispatch = useDispatch()

    const handleLogout = () => { dispatch(triggerRedirect()); }

    return (
        <>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">

                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Logout
                        </h2>
                        <div className="mt-5">
                            are you sure ?
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                    type="button"
                    onClick={() => handleLogout()}
                    className="cursor-pointer inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                    Logout
                </button>
                <button
                    type="button"
                    data-autofocus
                    onClick={() => dispatch(toggle())}
                    className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                    Cancel
                </button>
            </div>
        </>
    )
}