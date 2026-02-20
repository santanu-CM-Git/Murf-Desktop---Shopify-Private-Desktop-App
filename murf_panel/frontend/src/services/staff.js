// DEMO VERSION - Implementation code removed for copy protection
// This file demonstrates the structure of Staff API service

import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuth from './configs/apiConfigs';

export const staffsApi = createApi({
  reducerPath: 'staffsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Staff', 'Departments'], 
  endpoints: (builder) => ({
    // Get staff members
    getStaffs: builder.query({
      query: () => 'staff',
      providesTags: ['Staff'],
    }),

    // Get departments
    getDepartments: builder.query({
      query: () => 'departments',
      providesTags: ['Departments'],
    }),

    // Create staff member
    createStaffs: builder.mutation({
      query: (data) => ({
        url: '/staff',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Staff'],
    }),

    // Create department
    createDepartment: builder.mutation({
      query: (data) => ({
        url: '/departments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Departments'],
    }),

    // Update staff member
    updateStaff: builder.mutation({
      query: ({ id, patch }) => ({
        url: `staff/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Staff'],
    }),

    // Update department
    updateDepartment: builder.mutation({
      query: ({ id, patch }) => ({
        url: `departments/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Departments'],
    }),

    // Delete staff member
    deleteStaff: builder.mutation({
      query: ({ id }) => ({
        url: `staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff'],
    }),

    // Delete department
    deleteDepartment: builder.mutation({
      query: ({ id }) => ({
        url: `departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Departments'],
    }),

    // Source Name Mappings
    getSourceNameMappings: builder.query({
      query: () => 'source-name-mappings',
      providesTags: ['SourceNameMappings'],
    }),

    createSourceNameMapping: builder.mutation({
      query: (data) => ({
        url: '/source-name-mappings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SourceNameMappings'],
    }),

    updateSourceNameMapping: builder.mutation({
      query: ({ id, patch }) => ({
        url: `source-name-mappings/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['SourceNameMappings'],
    }),

    deleteSourceNameMapping: builder.mutation({
      query: ({ id }) => ({
        url: `source-name-mappings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SourceNameMappings'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateStaffsMutation,
  useGetStaffsQuery,
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetSourceNameMappingsQuery,
  useCreateSourceNameMappingMutation,
  useUpdateSourceNameMappingMutation,
  useDeleteSourceNameMappingMutation
} = staffsApi;
