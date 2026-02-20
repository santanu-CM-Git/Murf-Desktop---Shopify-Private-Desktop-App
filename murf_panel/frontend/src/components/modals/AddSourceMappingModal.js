import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggle, close } from "@/services/modalSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCreateSourceNameMappingMutation, useUpdateSourceNameMappingMutation } from "@/services/staff";

const AddSourceMappingModal = () => {
    const dispatch = useDispatch()

    const modalComp = useSelector((state) => state.modal.component)

    const [createDepartment, { isLoading, error }] = useCreateSourceNameMappingMutation();
    const [updateDepartment] = useUpdateSourceNameMappingMutation();
    

    const validationSchema = Yup.object({
        key: Yup.string().required("Key is required"),
        display_name: Yup.string().required("Display Name is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if(modalComp?.data){
                await updateDepartment({
                    id: modalComp?.data.id,           // Make sure `values` includes the `id` field
                    patch: values,
                  }).unwrap();
            }
            else{
                await createDepartment(values).unwrap();
            }
            
            dispatch(toggle());
        } catch (error) {
            console.error("Failed to create staff:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="relative p-4 w-full max-h-full">
                {/* <!-- Modal content --> */}
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Create New Source
                        </h3>
                        <button onClick={() => dispatch(toggle())} type="button" className="text-gray-400 bg-transparent cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    {error && <p className="p-2 text-center text-red-600 dark:text-red-300">{error?.data?.message}</p>}
                    <div className="p-4 md:p-5">
                        <Formik
                            initialValues={{ key: modalComp?.data?.key ?? "", display_name: modalComp?.data?.display_name ?? "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="grid gap-4 mb-4 grid-cols-2">
                                    
                                    <div className="col-span-2">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Key
                                        </label>
                                        <Field
                                            type="text"
                                            name="key"
                                            id="key"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                            placeholder="key name"
                                        />
                                        <ErrorMessage name="key" component="p" className="text-sm text-red-500 mt-1" />
                                    </div>

                                    <div className="col-span-2">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Display Name
                                        </label>
                                        <Field
                                            type="text"
                                            name="display_name"
                                            id="display_name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                            placeholder="Display name"
                                        />
                                        <ErrorMessage name="display_name" component="p" className="text-sm text-red-500 mt-1" />
                                    </div>

                                    

                                    <div className="col-span-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="text-white w-full inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
                                        >
                                            {modalComp?.data ?
                                            <>Update</>
                                            :
                                            <>
                                                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                                Add New
                                            </>}
                                            
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddSourceMappingModal