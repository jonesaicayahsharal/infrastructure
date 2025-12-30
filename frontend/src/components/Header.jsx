import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Sun, Zap, Wrench, Hammer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    {
      name: "Services",
      submenu: [
        { name: "Solar Installation", path: "/services/solar", icon: Sun },
        { name: "Electrical", path: "/services/electrical", icon: Zap },
        { name: "Carpentry", path: "/services/carpentry", icon: Hammer },
        { name: "Plumbing", path: "/services/plumbing", icon: Wrench },
      ],
    },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const [showServicesMenu, setShowServicesMenu] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? "header-scrolled" : "bg-transparent"
      }`}
      data-testid="main-header"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <nav className="flex items-center justify-between h-20">
          {/* Logo - Text based */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-10 h-10 bg-gold-500 flex items-center justify-center">
              <span className="font-heading font-black text-royal-950 text-xl">J</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg text-white tracking-tight">
                JONESAICA
              </span>
              <span className="block text-gold-400 text-[10px] font-medium tracking-widest uppercase -mt-1">
                Infrastructure
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.submenu ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setShowServicesMenu(true)}
                  onMouseLeave={() => setShowServicesMenu(false)}
                >
                  <button
                    className="text-royal-300 hover:text-gold-400 font-medium transition-colors"
                    data-testid="services-dropdown"
                  >
                    {link.name}
                  </button>
                  <AnimatePresence>
                    {showServicesMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 glass-card rounded-none py-2"
                      >
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.path}
                            to={sublink.path}
                            className="flex items-center gap-3 px-4 py-3 text-royal-300 hover:text-gold-400 hover:bg-gold-500/5 transition-colors"
                          >
                            <sublink.icon size={18} />
                            {sublink.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-gold-400"
                      : "text-royal-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              to="/quote"
              className="hidden sm:block btn-gold px-6 py-3 text-sm font-bold"
              data-testid="get-quote-btn"
            >
              Get Quote
            </Link>
            
            <button
              className="snipcart-checkout relative p-2 text-royal-300 hover:text-gold-400 transition-colors"
              data-testid="cart-btn"
            >
              <ShoppingCart size={24} />
              <span className="snipcart-items-count absolute -top-1 -right-1 bg-gold-500 text-royal-950 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"></span>
            </button>

            <button
              className="lg:hidden p-2 text-royal-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-card rounded-none mb-4 overflow-hidden"
            >
              <div className="py-4">
                {navLinks.map((link) =>
                  link.submenu ? (
                    <div key={link.name} className="px-4 py-2">
                      <p className="text-royal-400 text-sm font-medium mb-2">
                        {link.name}
                      </p>
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          className="flex items-center gap-3 px-4 py-2 text-royal-300 hover:text-gold-400"
                        >
                          <sublink.icon size={16} />
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-3 font-medium ${
                        location.pathname === link.path
                          ? "text-gold-400"
                          : "text-royal-300"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                )}
                <div className="px-4 pt-4">
                  <Link
                    to="/quote"
                    className="block w-full btn-gold px-6 py-3 text-center text-sm font-bold"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
