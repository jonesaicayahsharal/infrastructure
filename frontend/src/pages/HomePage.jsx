import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Zap, Hammer, Wrench, ArrowRight, CheckCircle, Phone, HardHat, HousePlug } from "lucide-react";
import axios from "axios";
import { API } from "../App";
import { ProductCard } from "../components/ProductCard";
import { ServiceCard } from "../components/ServiceCard";
import { ContactForm } from "../components/ContactForm";
import rickyHomeSolar from "../assets/images/ricky-home-solar.jpg";
import rickyElectrical from "../assets/images/ricky-electrical.jpg";
import rickyBoardHouse from "../assets/images/ricky-board-house.png";
import rickyPlumbing from "../assets/images/ricky-plumbing.jpg";
import rickyStanction from "../assets/images/ricky-stanction.jpg";
import rickySteelWork from "../assets/images/rickysteelwork.jpg";


const services = [
  {
    title: "Solar Installation",
    slug: "solar",
    description: "Complete solar energy solutions. Inverters, batteries, panels, and professional installation across Jamaica.",
    icon: Zap,
    image: rickyHomeSolar,
    path: "/services/solar",
  },
  {
    title: "Electrical Services",
    slug: "electrical",
    description: "Full electrical work for residential and commercial properties. Stanchion, Security Cameras, Piping, Wiring, installations, repairs, and upgrades, etc.",
    icon: HousePlug,
    image: rickyElectrical,
    path: "/services/electrical",
  },
  {
    title: "Carpentry",
    slug: "carpentry",
    description: "Roof prep, ceiling beams, slab work, animal pens, door jams, board housing, and structural carpentry, etc.",
    icon: Hammer,
    image: rickyBoardHouse,
    path: "/services/carpentry",
  },
  {
    title: "Plumbing",
    slug: "plumbing",
    description: "Comprehensive plumbing from installations to repairs. Water systems, drainage, fixtures, and tanks, etc.",
    icon: Wrench,
    image: rickyPlumbing,
    path: "/services/plumbing",
  },
  {
    title: "Steel Work",
    slug: "Steel Work",
    description: "Comprehensive steel work from foundation to going upstairs. Decking, foundation, column, beam, and caging, etc.",
    icon: HardHat,
    image: rickySteelWork,
    path: "/services/steelwork",
  },
];

const benefits = [
  "Island-Wide Service Coverage",
  "Competitive Pricing",
  "Quality Products & Materials",
  "Experienced Team",
  "Reliable Support",
  "Satisfaction Guaranteed",
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [heroProduct, setHeroProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        const data = response.data;
        // pick the Deye 5.12kWh battery explicitly
        const battery = data.find(p =>
          p.name.toLowerCase().includes("5.12")
        );

        setHeroProduct(battery);
        setProducts(data.slice(0, 6));

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
      <section className="hero-bg min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-royal-500 rounded-full filter blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-gold-400 text-sm font-bold uppercase tracking-widest mb-6 border border-gold-500/30 px-4 py-2">
                Solar & Building Solutions
              </span>
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
                POWERING<br />
                <span className="text-gold-400">JAMAICA'S</span><br />
                FUTURE
              </h1>
              <p className="text-royal-300 text-lg mb-8 max-w-lg">
                Premium solar installations, electrical work, plumbing, and carpentry 
                services. Quality equipment at competitive prices, serving all of Jamaica.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/products"
                  className="btn-gold px-8 py-4 text-center font-bold rounded-none"
                  data-testid="hero-shop-btn"
                >
                  Shop Products
                </Link>
                <Link
                  to="/quote"
                  className="btn-outline px-8 py-4 text-center font-bold rounded-none"
                  data-testid="hero-quote-btn"
                >
                  Get Free Quote
                </Link>
              </div>

              <div className="flex items-center gap-6 text-royal-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-gold-500" size={20} />
                  <span className="text-sm">Island-Wide Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-gold-500" size={20} />
                  <span className="text-sm">Best Prices</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {heroProduct && (
                <>
                  <div className="relative aspect-[4/3] rounded-none overflow-hidden border border-royal-700">
                    <img
                      src={heroProduct.image_url}
                      alt={heroProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-royal-950/60 to-transparent" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="absolute -bottom-6 -left-6 glass-card p-6 rounded-none border border-gold-500/30"
                  >
                    <p className="text-gold-400 font-bold text-2xl mb-1">
                      J${heroProduct.sale_price.toLocaleString()}
                    </p>
                    <p className="text-white text-sm">
                      Starting – {heroProduct.name}
                    </p>
                  </motion.div>
                </>
             )}
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
            <h2 className="font-heading font-black text-3xl md:text-5xl text-white mt-4 mb-6">
              OUR SERVICES
            </h2>
            <p className="text-royal-400 text-lg max-w-2xl mx-auto">
              From solar energy to building services, comprehensive solutions 
              for your home and business across Jamaica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.slug} 
                service={service} 
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
              <h2 className="font-heading font-black text-3xl md:text-5xl text-white mt-4">
                SOLAR EQUIPMENT
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
                <div key={i} className="glass-card rounded-none p-4 animate-pulse border border-royal-700/50">
                  <div className="aspect-square bg-royal-800 mb-4" />
                  <div className="h-4 bg-royal-800 w-1/4 mb-2" />
                  <div className="h-6 bg-royal-800 w-3/4 mb-4" />
                  <div className="h-8 bg-royal-800 w-1/2" />
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
              <h2 className="font-heading font-black text-3xl md:text-5xl text-white mt-4 mb-8">
                JAMAICA'S TRUSTED<br />INFRASTRUCTURE PARTNER
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
                    <CheckCircle className="text-gold-500 flex-shrink-0" size={20} />
                    <span className="text-royal-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 glass-card rounded-none border border-gold-500/30">
                <p className="text-royal-400 mb-4">Ready to start your project?</p>
                <a
                  href="tel:+18768422916"
                  className="flex items-center gap-3 text-white"
                >
                  <div className="p-3 bg-gold-500 rounded-none">
                    <Phone className="text-royal-950" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-royal-400">Call or WhatsApp us now</p>
                    <p className="font-bold text-xl">+1-876-842-2916</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="relative">
              <img
                src={rickyStanction}
                alt="Stanchion installation work"
                className="rounded-none border border-royal-700"
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
              <h2 className="font-heading font-black text-3xl md:text-5xl text-white mt-4 mb-6">
                CONTACT US TODAY
              </h2>
              <p className="text-royal-400 text-lg mb-8">
                Whether you need a quote, have questions about our services, or want to 
                discuss your project, we're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-500/10 rounded-none border border-gold-500/30">
                    <Phone className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Phone/WhatsApp</p>
                    <p className="text-royal-400">+1-876-842-2916</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-none border border-royal-700/50">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
