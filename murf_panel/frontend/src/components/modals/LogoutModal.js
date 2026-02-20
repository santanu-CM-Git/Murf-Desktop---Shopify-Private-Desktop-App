import React from 'react'
import { useDispatch } from "react-redux";
import { toggle, close } from "@/services/modalSlice";
import { triggerRedirect } from "@/services/redirectSlice";

const LogoutModal = () => {
    const dispatch = useDispatch()
    
    const handleLogout = () => { dispatch(toggle());dispatch(triggerRedirect()); }

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

export default LogoutModal