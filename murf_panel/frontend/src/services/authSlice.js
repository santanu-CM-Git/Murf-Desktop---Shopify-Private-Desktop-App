import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Initial state for authentication
const initialState = {
  accessToken: Cookies.get('authToken') || null, // Get the token from cookies, if available
  refreshToken: Cookies.get('refreshToken') || null, // Get the refresh token if available
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the access and refresh tokens
    setAuthTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      // Store tokens in cookies
      Cookies.set('authToken', accessToken,  { expires: 365, secure: false, sameSite: 'Strict' } );
      Cookies.set('refreshToken', refreshToken,  { expires: 365, secure: false, sameSite: 'Strict' } );
    },

    // Optional: Action to clear the tokens if the user logs out
    clearAuthTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      Cookies.remove('authToken');
      Cookies.remove('refreshToken');
    },
  },
});

// Export actions
export const { setAuthTokens, clearAuthTokens } = authSlice.actions;

// Export the reducer to add to the store
export default authSlice.reducer;
