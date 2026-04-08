/**
 * MIDDLEWARE: Logger
 * -------------------
 * PURPOSE: Middleware sits between dispatch() and the reducer.
 * Every action passes through middleware BEFORE reaching reducer.
 *
 * FLOW:
 * dispatch(action) → loggerMiddleware → reducer → new state
 *
 * HOW MIDDLEWARE WORKS:
 * - store  → gives access to getState() and dispatch()
 * - next   → function to pass action to next middleware or reducer
 * - action → the action object being dispatched
 *
 * Open browser DevTools Console to see every action logged.
 */
export const loggerMiddleware = (store) => (next) => (action) => {
  // Log action type and state BEFORE reducer runs
  console.group(`%c ACTION: ${action.type}`, "color: #3b82f6; font-weight: bold");
  console.log("%c Previous State:", "color: #94a3b8", store.getState());
  console.log("%c Action Payload:", "color: #f59e0b", action.payload);

  // Pass action forward to reducer
  const result = next(action);

  // Log state AFTER reducer has updated it
  console.log("%c Next State:", "color: #22c55e", store.getState());
  console.groupEnd();

  return result;
};