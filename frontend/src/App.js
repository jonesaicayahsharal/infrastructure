import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

// Layout Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LeadCaptureModal } from "./components/LeadCaptureModal";
import { Toaster } from "./components/ui/sonner";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import SolarServicePage from "./pages/services/SolarServicePage";
import ElectricalServicePage from "./pages/services/ElectricalServicePage";
import CarpentryServicePage from "./pages/services/CarpentryServicePage";
import PlumbingServicePage from "./pages/services/PlumbingServicePage";
import QuotePage from "./pages/QuotePage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API =
  process.env.REACT_APP_BACKEND_URL ||
  "https://infrastructure-production-cc30.up.railway.app";

function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Seed products on first load
    const seedProducts = async () => {
      try {
        await axios.post(`${API}/seed-products`);
      } catch (e) {
        console.log("Products initialized");
      }
    };
    seedProducts();

    // Show popup IMMEDIATELY on site open (if not seen before)
    const hasSeenPopup = localStorage.getItem("jonesaica_popup_seen");
    if (!hasSeenPopup) {
      setShowModal(true);
    }
  }, []);

  const handleModalClose = (submitted = false) => {
    setShowModal(false);
    if (submitted) {
      localStorage.setItem("jonesaica_popup_seen", "true");
    }
  };

  return (
    <div className="min-h-screen bg-royal-950">
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/services/solar" element={<SolarServicePage />} />
            <Route path="/services/electrical" element={<ElectricalServicePage />} />
            <Route path="/services/carpentry" element={<CarpentryServicePage />} />
            <Route path="/services/plumbing" element={<PlumbingServicePage />} />
          </Routes>
        </main>
        <Footer />
        
        {showModal && (
          <LeadCaptureModal onClose={handleModalClose} />
        )}
        
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
