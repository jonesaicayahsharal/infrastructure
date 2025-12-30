import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Zap, Hammer, Wrench, ArrowRight, CheckCircle, Phone } from "lucide-react";
import axios from "axios";
import { API } from "../App";
import { ProductCard } from "../components/ProductCard";
import { ServiceCard } from "../components/ServiceCard";
import { ContactForm } from "../components/ContactForm";

const services = [
  {
    title: "Solar Installation",
    slug: "solar",
    description: "Complete solar energy solutions including panel installation, inverters, batteries, and maintenance. Power your home with clean, renewable energy.",
    icon: Sun,
    image: "https://images.pexels.com/photos/9875423/pexels-photo-9875423.jpeg",
    path: "/services/solar",
  },
  {
    title: "Electrical Services",
    slug: "electrical",
    description: "Professional electrical work for residential and commercial properties. Wiring, installations, repairs, and upgrades.",
    icon: Zap,
    image: "https://images.pexels.com/photos/27928761/pexels-photo-27928761.jpeg",
    path: "/services/electrical",
  },
  {
    title: "Carpentry",
    slug: "carpentry",
    description: "Quality woodwork including decking, animal shelters, pens, door jams, and door installations. Built to last.",
    icon: Hammer,
    image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
    path: "/services/carpentry",
  },
  {
    title: "Plumbing",
    slug: "plumbing",
    description: "Comprehensive plumbing services from installations to repairs. Water systems, drainage, and fixtures.",
    icon: Wrench,
    image: "https://images.pexels.com/photos/7220892/pexels-photo-7220892.jpeg",
    path: "/services/plumbing",
  },
];

const benefits = [
  "Licensed & Insured Professionals",
  "Island-Wide Service Coverage",
  "Competitive Pricing",
  "Quality Products & Materials",
  "Expert Installation & Support",
  "Satisfaction Guaranteed",
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        setProducts(response.data.slice(0, 6)); // Show only 6 featured products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-gold-400 text-sm font-bold uppercase tracking-widest mb-6">
                Powering Jamaica's Future
              </span>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Solar Energy &<br />
                <span className="text-gold-gradient">Building Solutions</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 max-w-lg">
                Jonesaica Infrastructure Solutions provides premium solar installations, 
                electrical, plumbing, and carpentry services across Jamaica. 
                Quality workmanship, competitive prices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/products"
                  className="btn-primary px-8 py-4 text-center font-bold"
                  data-testid="hero-shop-btn"
                >
                  Shop Products
                </Link>
                <Link
                  to="/quote"
                  className="btn-secondary px-8 py-4 text-center font-bold"
                  data-testid="hero-quote-btn"
                >
                  Get Free Quote
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-gold-400" size={20} />
                  <span className="text-sm">Island-Wide Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-gold-400" size={20} />
                  <span className="text-sm">Best Prices</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/9875423/pexels-photo-9875423.jpeg"
                  alt="Solar panel installation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-950/50 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 -left-6 glass p-6 rounded-lg max-w-xs"
              >
                <p className="text-gold-400 font-bold text-2xl mb-1">J$132,000</p>
                <p className="text-white text-sm">Starting from - Deye 5.12kWh Battery</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32 bg-royal-950" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
              What We Do
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-4 mb-6">
              Our Services
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From solar energy to building services, we provide comprehensive solutions 
              for your home and business across Jamaica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.slug} 
                service={service} 
                index={index}
                size={index === 0 ? "large" : "normal"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 md:py-32 bg-royal-900/30" data-testid="products-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
                Featured Products
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-4">
                Solar Equipment
              </h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 text-gold-400 font-medium hover:gap-3 transition-all"
              data-testid="view-all-products-link"
            >
              View All Products <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-royal-800 rounded mb-4" />
                  <div className="h-4 bg-royal-800 rounded w-1/4 mb-2" />
                  <div className="h-6 bg-royal-800 rounded w-3/4 mb-4" />
                  <div className="h-8 bg-royal-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 bg-royal-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
                Why Choose Us
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-4 mb-8">
                Jamaica's Trusted<br />Infrastructure Partner
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-gold-400 flex-shrink-0" size={20} />
                    <span className="text-slate-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 glass rounded-lg">
                <p className="text-slate-400 mb-4">Ready to start your project?</p>
                <a
                  href="tel:+18768422916"
                  className="flex items-center gap-3 text-white"
                >
                  <div className="p-3 bg-gold-400 rounded-lg">
                    <Phone className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Call us now</p>
                    <p className="font-bold text-xl">+1 (876) 842-2916</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7605954/pexels-photo-7605954.jpeg"
                alt="Solar installation team"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 md:py-32 bg-royal-900/30" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
                Get In Touch
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-4 mb-6">
                Contact Us Today
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Whether you need a quote, have questions about our services, or want to 
                discuss your project, we're here to help. Reach out and let's build something great together.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-400/10 rounded-lg">
                    <Phone className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-slate-400">+1 (876) 842-2916</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
