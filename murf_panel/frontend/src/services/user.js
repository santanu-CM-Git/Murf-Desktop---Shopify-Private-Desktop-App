// DEMO VERSION - Implementation code removed for copy protection
// This file demonstrates the structure of User API service

import { createApi } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import baseQueryWithAuth from './configs/apiConfigs';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    // Get profile
    getUsers: builder.query({
      query: () => 'profile',
    }),

    // Get user by name
    getUsersByName: builder.query({
      query: (name) => `users?name=${encodeURIComponent(name)}`,
    }),

    // Create a new user
    createUsers: builder.mutation({
      query: (newUsers) => ({
        url: 'users',
        method: 'POST',
        body: newUsers,
      }),
    }),

    // User login
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/token',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation({
      query: () => ({
        url: '/token/refresh',
        method: 'POST',
        body: { refresh: Cookies.get('refreshToken') },
      }),
    }),

    changePassword: builder.mutation({
      query: (credentials) => ({
        url: '/change-password',
        method: 'POST',
        body: credentials,
      }),
    }),

    getStores: builder.query({
      query: () => '/stores',
      providesTags: ['Stores'],
    }),

    addStore: builder.mutation({
      query: (storeData) => ({
        url: '/stores',
        method: 'POST',
        body: storeData,
      }),
      invalidatesTags: ['Stores'],
    }),

    setPrimaryStore: builder.mutation({
      query: (storeId) => ({
        url: `/stores/${storeId}/set_primary/`,
        method: 'PATCH',
        body: { is_primary: true },
      }),
      invalidatesTags: ['Stores'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUsersQuery,
  useGetUsersByNameQuery,
  useCreateUsersMutation,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useGetStoresQuery,
  useAddStoreMutation,
  useSetPrimaryStoreMutation
} = usersApi;
