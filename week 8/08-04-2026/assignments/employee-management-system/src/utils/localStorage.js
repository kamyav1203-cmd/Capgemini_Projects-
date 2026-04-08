/**
 * UTILITY: localStorage Persistence
 * ----------------------------------
 * PURPOSE: Save and load Redux state from browser's localStorage.
 * This means if user refreshes the page, their data is NOT lost.
 * Redux store resets on refresh by default — this fixes that.
 */

/**
 * saveState: Called every time Redux store updates.
 * Converts state object to JSON string and saves to localStorage.
 */
export const saveState = (state) => {
  try {
    localStorage.setItem("reduxState", JSON.stringify(state));
  } catch (err) {
    console.error("Could not save state to localStorage:", err);
  }
};

/**
 * loadState: Called once when app starts.
 * Reads saved JSON from localStorage and converts back to object.
 * Returns undefined if nothing saved yet (first visit).
 */
export const loadState = () => {
  try {
    const saved = localStorage.getItem("reduxState");
    return saved ? JSON.parse(saved) : undefined;
  } catch (err) {
    return undefined;
  }
};