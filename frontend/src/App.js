import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

// Layout Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CustomerCaptureModal } from "./components/CustomerCaptureModal";
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
export const API = `${BACKEND_URL}/api`;

function App() {
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  useEffect(() => {
    // Seed products on first load
    const seedProducts = async () => {
      try {
        await axios.post(`${API}/seed-products`);
      } catch (e) {
        console.log("Products may already be seeded");
      }
    };
    seedProducts();

    // Check if user has seen modal before
    const seenModal = localStorage.getItem("jonesaica_modal_seen");
    if (!seenModal) {
      const timer = setTimeout(() => {
        setShowCaptureModal(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenModal(true);
    }
  }, []);

  const handleModalClose = () => {
    setShowCaptureModal(false);
    localStorage.setItem("jonesaica_modal_seen", "true");
    setHasSeenModal(true);
  };

  return (
    <div className="noise-overlay min-h-screen">
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
        
        {showCaptureModal && (
          <CustomerCaptureModal onClose={handleModalClose} />
        )}
        
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
