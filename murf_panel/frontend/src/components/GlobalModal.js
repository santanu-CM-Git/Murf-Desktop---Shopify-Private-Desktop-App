import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { useDispatch, useSelector } from "react-redux";
import { toggle, close } from "@/services/modalSlice";
import LogoutModal from "./modals/LogoutModal";
import AddEmployeesModal from "./modals/AddEmployeesModal";
import DeleteModal from "./modals/DeleteModal";
import AddDepartmentModal from "./modals/AddDepartmentModal";
import AddAccountMappingModal from "./modals/AddAccountMappingModal";
import AddSourceMappingModal from "./modals/AddSourceMappingModal";

export default function GlobalModal({ title = "" }) {

    const isOpen = useSelector((state) => state.modal.open)
    const Component = useSelector((state) => state.modal.component)
    const dispatch = useDispatch()

    const ALL_MODEL = {
        "LOG_OUT": <LogoutModal />,
        "DELETE_DATA": <DeleteModal />,
        "ADD_EMPLOYEE": <AddEmployeesModal />,
        "ADD_DEPARTMENT": <AddDepartmentModal />,
        "ADD_MAPPING": <AddAccountMappingModal />,
        "ADD_SOURCE_MAPPING": <AddSourceMappingModal />,
    }

    return (
        <>
            <Dialog open={isOpen} onClose={()=>{ dispatch(toggle() )}} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-700 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            {Component && ALL_MODEL[Component.name]}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}