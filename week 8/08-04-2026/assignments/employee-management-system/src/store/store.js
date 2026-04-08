/**
 * REDUX STORE — Single Source of Truth
 * --------------------------------------
 * PURPOSE: The store holds ALL application state in one place.
 *
 * WHAT IS A STORE?
 * - Central place where all state lives
 * - Components READ state using useSelector(state => state.sliceName)
 * - Components UPDATE state using useDispatch() + dispatch(action)
 * - State can ONLY change through dispatched actions
 *
 * THIS STORE HAS 3 REDUCERS (slices):
 * - auth      → login/logout, current user info
 * - employees → employee list, CRUD operations
 * - theme     → dark/light mode toggle
 *
 * PERSISTENCE:
 * - loadState() → reads saved state from localStorage on app start
 * - store.subscribe() → saves state to localStorage on every change
 *
 * MIDDLEWARE:
 * - loggerMiddleware → logs every action to browser console
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "../features/employees/employeeSlice";
import themeReducer from "../features/theme/themeSlice";
import { loggerMiddleware } from "../middleware/loggerMiddleware";
import { loadState, saveState } from "../utils/localStorage";

// Load previously saved state from localStorage
const preloadedState = loadState();

const store = configureStore({
  reducer: {
    auth: authReducer,           // accessible as state.auth
    employees: employeeReducer,  // accessible as state.employees
    theme: themeReducer,         // accessible as state.theme
  },
  preloadedState, // use saved state instead of empty initial state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

// Save to localStorage every time state changes
store.subscribe(() => saveState(store.getState()));

export default store;