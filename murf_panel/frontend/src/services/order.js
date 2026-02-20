// DEMO VERSION - Implementation code removed for copy protection
// This file demonstrates the structure of Order API service

import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuth from './configs/apiConfigs';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    // Get total orders
    getTotalOrders: builder.query({
      query: () => '/orders/total',
    }),

    // Get All Orders
    getAllOrders: builder.query({
      query: ({ limit = 15, filter }) => {
        // Implementation removed for demo version
        return '/orders';
      },
    }),  

    // Export orders to Excel
    exportOrders: builder.query({
      query: ({ limit = 15, filter }) => {
        // Implementation removed for demo version
        return '/orders/export-orders-excel';
      },
    }),  

    // Export orders to QuickBooks
    exportQBOrders: builder.query({
      query: ({ limit = 15, filter }) => {
        // Implementation removed for demo version
        return '/orders/export-orders-qb';
      },
    }),
    
    createExportOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders/export-orders-excel",
        method: "POST",
        body: orderData,
      }),
    }),

    createExportJE: builder.mutation({
      query: (orderData) => ({
        url: "/orders/export-orders-qb",
        method: "POST",
        body: orderData,
      }),
    }),

    // Get sale report from dashboard
    getSaleReport: builder.query({
      query: ({ filterBy }) => {
        // Implementation removed for demo version
        return `/orders/current-month-sale?filterBy=${filterBy}`;
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTotalOrdersQuery,
  useLazyExportOrdersQuery,
  useLazyExportQBOrdersQuery,
  useLazyGetAllOrdersQuery,
  useCreateExportOrderMutation,
  useCreateExportJEMutation,
  useLazyGetSaleReportQuery
} = ordersApi;
