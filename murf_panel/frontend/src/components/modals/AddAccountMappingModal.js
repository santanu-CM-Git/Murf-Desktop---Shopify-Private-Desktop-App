import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "@/services/modalSlice";
import { useCreateAccountMappingMutation, useUpdateAccountMappingMutation, useGetAccountMappingsQuery } from "@/services/accountMapping";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddAccountMappingModal = () => {
  const dispatch = useDispatch();
  const modalComp = useSelector((state) => state.modal.component);

  const [createAccountMapping, { isLoading, error }] = useCreateAccountMappingMutation();
  const [updateAccountMapping] = useUpdateAccountMappingMutation();
  const { data: accountMappings, isLoading: isFetchingAccounts } = useGetAccountMappingsQuery(); // Fetch all account mappings for parent dropdown

  const validationSchema = Yup.object({
    account: Yup.string().required("Account is required"),
    payment_method: Yup.string().nullable(),
    full_name: Yup.string().nullable(),
    type: Yup.string().nullable(),
    tags: Yup.array(),
    sum_of: Yup.string().nullable(),
    parent: Yup.number().nullable(), // Parent is an ID (number) or null
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        ...values,
        tags: values.tags || [], // Ensure tags is always an array
        parent: values.parent || null, // Ensure parent is null if not selected
      };

      if (modalComp?.data) {
        await updateAccountMapping({
          id: modalComp.data.id,
          patch: payload,
        }).unwrap();
      } else {
        await createAccountMapping(payload).unwrap();
      }

      dispatch(toggle());
    } catch (error) {
      console.error("Failed to process account mapping:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative p-4 w-full max-h-full">
      <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {modalComp?.data ? "Update Mapping" : "Create New Mapping"}
          </h3>
          <button
            onClick={() => dispatch(toggle())}
            type="button"
            className="text-gray-400 bg-transparent cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {error && (
          <p className="p-2 text-center text-red-600 dark:text-red-300">{error?.data?.message}</p>
        )}

        <div className="p-4 md:p-5">
          <Formik
            initialValues={{
              account: modalComp?.data?.account ?? "",
              payment_method: modalComp?.data?.payment_method ?? "",
              full_name: modalComp?.data?.full_name ?? "",
              type: modalComp?.data?.type ?? "",
              tags: modalComp?.data?.tags ?? [],
              sum_of: modalComp?.data?.sum_of ?? "extendedPrice",
              parent: modalComp?.data?.parent ?? "", // Use parent ID if editing
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="account" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Account
                  </label>
                  <Field
                    type="text"
                    name="account"
                    id="account"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Type account"
                  />
                  <ErrorMessage name="account" component="p" className="text-sm text-red-500 mt-1" />
                </div>

                <div className="col-span-2">
                  <label htmlFor="payment_method" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Payment Method
                  </label>
                  <Field
                    type="text"
                    name="payment_method"
                    id=",_method"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Type payment method"
                  />
                  <ErrorMessage name="payment_method" component="p" className="text-sm text-red-500 mt-1" />
                </div>

                <div className="col-span-2">
                  <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="full_name"
                    id="full_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Type full name"
                  />
                  <ErrorMessage name="full_name" component="p" className="text-sm text-red-500 mt-1" />
                </div>

                <div className="col-span-2">
                  <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Type
                  </label>
                  <Field
                    as="select"
                    name="type"
                    id="type"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  >
                    <option value="">Select Type</option>
                    <option value="Credits">Credits</option>
                    <option value="Debits">Debits</option>
                  </Field>
                  <ErrorMessage name="type" component="p" className="text-sm text-red-500 mt-1" />
                </div>

                <div className="col-span-2">
                  <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tags (comma-separated)
                  </label>
                  <Field
                    type="text"
                    name="tags"
                    id="tags"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Type tags (e.g., tag1, tag2, tag3)"
                    onChange={(e) => {
                      const tagsArray = e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== "");
                      setFieldValue("tags", tagsArray);
                    }}
                    value={values.tags.join(", ")}
                  />
                  <ErrorMessage name="tags" component="p" className="text-sm text-red-500 mt-1" />
                </div>

                <div className="col-span-2">
                  <label htmlFor="sum_of" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Sum Of
                  </label>
                  <Field
                    as="select"
                    name="sum_of"
                    id="sum_of"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Type sum of"
                  >
                    <option value="none">None (0)</option>
                    <option value="transactions">Transactions</option>
                    <option value="extendedPrice">Extended Price</option>
                    <option value="total">Total Price</option>
                    <option value="discountAmount">Discount Amount</option>
                    <option value="refundedAmount">Refunded Amount</option>
                    <option value="lineitemRefundedSubtotal">Lineitem Refunded Subtotal OR Refunded Amount</option>
                    <option value="shippingLinesPrices">Shipping</option>
                    <option value="lineItemCogs">Line Item COGS</option>
                    <option value="refundedCogs">Refunded COGS</option>
                    <option value="taxes">Taxes</option>
                    <option value="lineitemRefundedTaxes">Line Item Refunded Taxes</option>
                    <option value="line_item_price">Line item price</option>
                    <option value="line_item_discount">Line Item Discount</option>
                </Field>
                  <ErrorMessage name="sum_of" component="p" className="text-sm text-red-500 mt-1" />
                </div>

                <div className="col-span-2">
                  <label htmlFor="parent" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Parent Account
                  </label>
                  <Field
                    as="select"
                    name="parent"
                    id="parent"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    disabled={isFetchingAccounts}
                  >
                    
                    <option value="">No Parent</option>
                    {accountMappings?.data?.map((mapping) => (
                      // Exclude current account from parent dropdown when editing
                      modalComp?.data?.id !== mapping.id && (
                        <option key={mapping.id} value={mapping.id}>
                          {mapping.full_name ? ` ${!mapping?.parent ? ' -----------------' : ''} ${mapping.full_name} ${!mapping?.parent ? ' -----------------' : ''}` : `Account ${mapping.account}`}
                        </option>
                      )
                    ))}
                  </Field>
                  <ErrorMessage name="parent" component="p" className="text-sm text-red-500 mt-1" />
                  {isFetchingAccounts && <p className="text-sm text-gray-500 mt-1">Loading parent accounts...</p>}
                </div>

                <div className="col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isFetchingAccounts}
                    className="text-white w-full inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover_forest green dark:hover:bg-blue-700"
                  >
                    {modalComp?.data ? (
                      "Update"
                    ) : (
                      <>
                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Add New
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddAccountMappingModal;