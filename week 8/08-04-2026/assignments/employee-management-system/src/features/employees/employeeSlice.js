/**
 * EMPLOYEE SLICE
 * ---------------
 * PURPOSE: Manages all employee data — Add, Edit, Delete, Search.
 *
 * IMMUTABILITY IN REDUX:
 * State must NEVER be directly mutated. Always return new state.
 * WRONG:  state.list.push(item)       ← mutates directly
 * RIGHT (without toolkit): return { ...state, list: [...state.list, item] }
 * RIGHT (with toolkit):    state.list.push(item) ← Immer handles it safely
 *
 * Redux Toolkit uses Immer library internally.
 * Immer lets you write "mutating" code that actually produces
 * a new immutable state behind the scenes.
 *
 * EXPORTED ACTIONS:
 * - addEmployee(employeeObject)      → adds new employee to list
 * - updateEmployee({id, ...fields})  → updates employee by id
 * - deleteEmployee(id)               → removes employee by id
 * - setSearchQuery(string)           → updates search filter
 * - setLoading(boolean)              → shows/hides loading spinner
 */

import { createSlice } from "@reduxjs/toolkit";

// Default employees shown when app first loads
const initialState = {
  list: [
    { id: 1, name: "Rahul Sharma",  dept: "Engineering", role: "Developer",   salary: 75000, status: "Active"   },
    { id: 2, name: "Priya Singh",   dept: "Design",       role: "UI Designer", salary: 65000, status: "Active"   },
    { id: 3, name: "Arjun Mehta",   dept: "Marketing",    role: "Manager",     salary: 80000, status: "Active"   },
    { id: 4, name: "Sneha Patel",   dept: "HR",           role: "HR Lead",     salary: 70000, status: "Inactive" },
  ],
  loading: false,      // controls LoadingSpinner visibility
  searchQuery: "",     // filters employee list
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    /**
     * addEmployee reducer
     * Adds a new employee object to the list.
     * Uses Date.now() as unique ID.
     */
    addEmployee: (state, action) => {
      state.list.push({ ...action.payload, id: Date.now() });
    },

    /**
     * updateEmployee reducer
     * Finds employee by id and updates their fields.
     * Uses findIndex to locate, then spreads new values.
     */
    updateEmployee: (state, action) => {
      const { id, ...updatedFields } = action.payload;
      const index = state.list.findIndex((e) => e.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updatedFields };
      }
    },

    /**
     * deleteEmployee reducer
     * Removes employee with matching id from list.
     * filter() returns new array without the deleted employee.
     */
    deleteEmployee: (state, action) => {
      state.list = state.list.filter((e) => e.id !== action.payload);
    },

    /**
     * setSearchQuery reducer
     * Updates the search string used to filter employee table.
     */
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    /**
     * setLoading reducer
     * true  → shows LoadingSpinner overlay
     * false → hides LoadingSpinner overlay
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSearchQuery,
  setLoading,
} = employeeSlice.actions;

export default employeeSlice.reducer;