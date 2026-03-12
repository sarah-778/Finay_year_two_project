import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import AllProducts from "./pages/AllProducts";
import CategoryBrands from "./pages/CategoryBrands";
import Shop from "./pages/Shop";
import RepairService from "./pages/RepairService";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart";

function App() {
  const location = useLocation(); //

  // Check if the current route is an admin route
  const isAdminPath = location.pathname.startsWith('/admin'); //

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hide Navbar on Admin pages */}
      {!isAdminPath && <Navbar />}

      {/* Remove horizontal padding (p-4) on Admin pages 
          so the sidebar sits flush against the edge
      */}
      <main className={isAdminPath ? "" : "p-4"}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Shop / Products */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/category/:slug" element={<CategoryBrands />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cart" element={<Cart />} />

          {/* Services */}
          <Route path="/repair-service" element={<RepairService />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* About */}
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* Hide Footer on Admin pages */}
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;