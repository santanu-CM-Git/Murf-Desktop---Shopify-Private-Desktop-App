// DEMO VERSION - Implementation code removed for copy protection
// This file demonstrates the structure of Account Mapping API service

import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuth from './configs/apiConfigs';

export const accountMappingApi = createApi({
  reducerPath: 'accountMappingApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['AccountMappings'], 
  endpoints: (builder) => ({
    // Get account mappings
    getAccountMappings: builder.query({
      query: () => 'account-mappings',
      providesTags: ['AccountMappings'],
    }),

    // Create account mapping
    createAccountMapping: builder.mutation({
      query: (data) => ({
        url: '/account-mappings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AccountMappings'],
    }),

    // Update account mapping
    updateAccountMapping: builder.mutation({
      query: ({ id, patch }) => ({
        url: `account-mappings/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['AccountMappings'],
    }),

    // Delete account mapping
    deleteAccountMapping: builder.mutation({
      query: ({ id }) => ({
        url: `account-mappings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AccountMappings'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateAccountMappingMutation,
  useGetAccountMappingsQuery,
  useUpdateAccountMappingMutation,
  useDeleteAccountMappingMutation
} = accountMappingApi;
