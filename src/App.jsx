import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "./context/CompanyContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CompanySettings from "./pages/CompanySettings";
import Shop from "./pages/Shop";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import ProductDetail from "./pages/ProductDetail";

export default function App() {
  return (
    <BrowserRouter>
      <CompanyProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/admin/company"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <CompanySettings />
                    </ProtectedRoute>
                  }
                />
                <Route path="/shop" element={<Shop />} />
<Route path="/admin/products" element={
  <ProtectedRoute allowedRoles={["Admin"]}><ProductsAdmin /></ProtectedRoute>
} />
<Route path="/admin/categories" element={
  <ProtectedRoute allowedRoles={["Admin"]}><CategoriesAdmin /></ProtectedRoute>
} />
<Route path="/products/:id" element={<ProductDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </CompanyProvider>
    </BrowserRouter>
  );
}