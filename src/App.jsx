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
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./pages/Orders/Checkout";
import Orders from "./pages/Orders/Orders";
import OrdersAdmin from "./pages/admin/OrdersAdmin";

export default function App() {
  return (
   <BrowserRouter>
      <CompanyProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <CartDrawer />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/checkout" element={
                    <ProtectedRoute><Checkout /></ProtectedRoute>
                  } />
                 <Route path="/orders" element={
  <ProtectedRoute allowedRoles={["Customer"]}><Orders /></ProtectedRoute>
} />
<Route path="/orders/:id" element={
  <ProtectedRoute allowedRoles={["Customer"]}><Orders /></ProtectedRoute>
} />
                  <Route path="/admin/company" element={
                    <ProtectedRoute allowedRoles={["Admin"]}><CompanySettings /></ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute allowedRoles={["Admin"]}><ProductsAdmin /></ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute allowedRoles={["Admin"]}><CategoriesAdmin /></ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
  <ProtectedRoute allowedRoles={["Admin"]}><OrdersAdmin /></ProtectedRoute>
} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </CompanyProvider>
    </BrowserRouter>
  );
}