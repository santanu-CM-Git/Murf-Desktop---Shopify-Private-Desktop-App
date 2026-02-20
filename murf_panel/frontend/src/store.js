import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'

import modalReducer from './services/modalSlice'
import redirectReducer from './services/redirectSlice'
import redirectMiddleware from './services/middleware/redirectMiddleware'
import authReducer from './services/authSlice'

import { pokemonApi } from './services/pokemon'
import { usersApi } from './services/user'
import { ordersApi } from './services/order'
import { staffsApi } from './services/staff'
import { accountMappingApi } from './services/accountMapping'

const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
     modal: modalReducer,
     redirect: redirectReducer,
     auth: authReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [staffsApi.reducerPath]: staffsApi.reducer,
    [accountMappingApi.reducerPath]: accountMappingApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(
      redirectMiddleware, 
      usersApi.middleware,
      pokemonApi.middleware,
      ordersApi.middleware,
      staffsApi.middleware,
      accountMappingApi.middleware,
    ),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
export default store;
