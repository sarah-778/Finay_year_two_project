import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import AllProducts from "./pages/All Products";
import CategoryBrands from "./pages/CategoryBrands";
import Shop from "./pages/Shop";
import BookRepair from "./pages/BookRepair";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar visible on all pages */}
      <Navbar />

      <main className="p-4">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Shop / Products */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/category/:slug" element={<CategoryBrands />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />}/>

          {/* Book Repair */}
          <Route path="/book-repair" element={<BookRepair />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* About */}
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;