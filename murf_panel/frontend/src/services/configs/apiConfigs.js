import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { setAuthTokens } from '../authSlice';

// Initialize fetchBaseQuery with base URL
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.BASE_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get('authToken'); // Get token from cookies
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom baseQuery to handle token refresh
const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    // Attempt to refresh token
    const refreshToken = Cookies.get('refreshToken');

    if (refreshToken) {

      const { usersApi } = await import('../user');
      
      const refreshResponse = await api.dispatch(usersApi.endpoints.refreshToken.initiate());

      if (refreshResponse?.data?.data?.access_token) {
        const newToken = refreshResponse.data.data?.access_token;
        const newRefreshToken = refreshResponse.data.data?.refresh_token;
        //Cookies.set('authToken', newToken); // Store new token in cookies

        api.dispatch(setAuthTokens({ accessToken: newToken, refreshToken: newRefreshToken }));

        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }
  
  return result;
};

export default baseQueryWithAuth