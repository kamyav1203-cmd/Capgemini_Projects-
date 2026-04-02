import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/mainlayout";
import AuthLayout from "./components/authlayout";
import DashboardLayout from "./components/dashboardlayout";
import ProtectedRoute from "./components/protectedroute";

import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Register from "./pages/register";
import DashboardHome from "./pages/dashboardhome";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";
import Products from "./pages/products";
import ProductDetails from "./pages/productdetails";
import Reviews from "./pages/reviews";
import Specs from "./pages/specs";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetails />}>
          <Route path="reviews" element={<Reviews />} />
          <Route path="specs" element={<Specs />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;