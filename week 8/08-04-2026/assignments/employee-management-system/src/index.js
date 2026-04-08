/**
 * ENTRY POINT: index.js
 * ----------------------
 * PURPOSE: Root of the React application.
 *
 * PROVIDER COMPONENT:
 * <Provider store={store}> makes the Redux store available to
 * ALL components in the app without passing it as props.
 * Any component can now use useSelector() and useDispatch().
 *
 * WITHOUT Provider → components cannot access Redux store.
 * WITH Provider    → any component anywhere can read/update state.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Provider wraps the entire app — makes store accessible everywhere
  <Provider store={store}>
    <App />
  </Provider>
);