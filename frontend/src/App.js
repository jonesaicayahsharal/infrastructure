import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LeadCaptureModal } from "./components/LeadCaptureModal";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./context/CartContext";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import SolarServicePage from "./pages/services/SolarServicePage";
import ElectricalServicePage from "./pages/services/ElectricalServicePage";
import CarpentryServicePage from "./pages/services/CarpentryServicePage";
import PlumbingServicePage from "./pages/services/PlumbingServicePage";
import SteelWorkPage from "./pages/services/SteelWorkPage";
import QuotePage from "./pages/QuotePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";

export const API = "https://infrastructure-production-cc30.up.railway.app/api";

function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Restore the original product-catalog initialization used by this site.
    // The backend now protects this route so an existing catalog is never deleted.
    const seedProducts = async () => {
      try {
        await axios.post(`${API}/seed-products`);
      } catch (e) {
        console.log("Products initialized");
      }
    };
    seedProducts();

    if (!localStorage.getItem("jonesaica_popup_seen")) {
      setShowModal(true);
    }
  }, []);

  const handleModalClose = (submitted = false) => {
    setShowModal(false);
    if (submitted) localStorage.setItem("jonesaica_popup_seen", "true");
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-royal-950">
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/quote" element={<QuotePage />} />
              <Route path="/services/solar" element={<SolarServicePage />} />
              <Route path="/services/electrical" element={<ElectricalServicePage />} />
              <Route path="/services/carpentry" element={<CarpentryServicePage />} />
              <Route path="/services/plumbing" element={<PlumbingServicePage />} />
              <Route path="/services/steelwork" element={<SteelWorkPage />} />
            </Routes>
          </main>
          <Footer />
          {showModal && <LeadCaptureModal onClose={handleModalClose} />}
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;
