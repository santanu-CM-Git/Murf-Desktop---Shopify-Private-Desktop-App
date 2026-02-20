// src/middleware/redirectMiddleware.js
import { triggerRedirect } from '@/services/redirectSlice';

const redirectMiddleware = (store) => (next) => (action) => {
    // console.log('actionaction', action);
    
  // Check if the action is a response to a query/mutation
  if (action.type.includes('usersApi')) {
    if (action.payload?.status === 401 || action.payload?.status === 403) {
      // If the action payload has a 401 or 403 status, trigger the redirect
      store.dispatch(triggerRedirect());
    }
  }
  return next(action);
};

export default redirectMiddleware;
