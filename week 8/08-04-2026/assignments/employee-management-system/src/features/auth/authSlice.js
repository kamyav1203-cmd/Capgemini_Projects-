/**
 * AUTH SLICE
 * -----------
 * PURPOSE: Manages authentication state — login, logout, errors.
 *
 * WHAT IS A SLICE?
 * createSlice() automatically creates:
 * - Action creators (login, logout, clearError)
 * - A reducer function that handles those actions
 * - Action type strings ("auth/login", "auth/logout")
 *
 * WHAT IS A REDUCER?
 * A function that takes (currentState, action) and returns NEW state.
 * Redux Toolkit uses Immer internally — so you can write:
 *   state.user = something   (looks like mutation but it's safe)
 *
 * REDUX DATA FLOW FOR LOGIN:
 * 1. User clicks Login
 * 2. dispatch(login({ email, password })) called
 * 3. Action { type: "auth/login", payload: {email, password} } created
 * 4. loggerMiddleware logs it to console
 * 5. login reducer checks credentials
 * 6. If valid → state.user set, state.isAuthenticated = true
 * 7. Store updates
 * 8. All components using useSelector(state => state.auth) re-render
 *
 * EXPORTED ACTIONS:
 * - login({ email, password }) → validates credentials, sets user
 * - logout()                   → clears user, sets isAuthenticated false
 * - clearError()               → removes error message from state
 */

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  // INITIAL STATE: default values when app first loads
  initialState: {
    user: null,              // currently logged in user object
    isAuthenticated: false,  // is user logged in?
    error: null,             // error message if login fails
  },

  reducers: {
    /**
     * login reducer
     * Checks if email+password match valid users.
     * If yes → sets user and isAuthenticated.
     * If no  → sets error message.
     */
    login: (state, action) => {
      const { email, password } = action.payload;

      if (email === "admin@company.com" && password === "admin123") {
        state.user = { name: "Admin User", email, role: "Admin" };
        state.isAuthenticated = true;
        state.error = null;
      } else if (email === "emp@company.com" && password === "emp123") {
        state.user = { name: "John Employee", email, role: "Employee" };
        state.isAuthenticated = true;
        state.error = null;
      } else {
        // Invalid credentials — set error, don't change user
        state.error = "Invalid email or password. Try admin@company.com / admin123";
      }
    },

    /**
     * logout reducer
     * Clears all user data from state.
     * User will be redirected to login page by ProtectedRoute.
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    /**
     * clearError reducer
     * Removes error message — called before new login attempt.
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export action creators for use in components
export const { login, logout, clearError } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;