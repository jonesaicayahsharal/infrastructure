import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Products", path: "/products" },
    { name: "Solar Services", path: "/services/solar" },
    { name: "Electrical", path: "/services/electrical" },
    { name: "Carpentry", path: "/services/carpentry" },
    { name: "Plumbing", path: "/services/plumbing" },
  ];

  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Get a Quote", path: "/quote" },
  ];

  return (
    <footer className="bg-royal-950 border-t border-royal-800" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold-500 flex items-center justify-center">
                <span className="font-heading font-black text-royal-950 text-xl">J</span>
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-tight block">
                  JONESAICA
                </span>
                <span className="text-gold-400 text-[10px] font-medium tracking-widest uppercase">
                  Infrastructure
                </span>
              </div>
            </div>
            <p className="text-royal-400 mb-6 leading-relaxed">
              Building Jamaica's future with quality solar solutions and building services across the island.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-royal-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-royal-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">+1-876-842-2916</p>
                  <p className="text-royal-500 text-sm">Mon-Sat 8am-6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-royal-400">Greenwood/Lilliput District</p>
                  <p className="text-royal-400">St. James, Jamaica</p>
                  <p className="text-royal-500 text-sm">Serving Island-Wide</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-royal-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-royal-500 text-sm">
              &copy; {currentYear} Jonesaica Infrastructure Solutions. All rights reserved.
            </p>
            <p className="text-royal-600 text-sm">
              Trelawny - St. James & Island-Wide Service
            </p>
          </div>
        </div>
      </div>

      {/* Giant Logo */}
      <div className="border-t border-royal-800/50 py-8 overflow-hidden">
        <p className="font-heading font-black text-[6rem] md:text-[10rem] lg:text-[14rem] text-royal-900/30 text-center leading-none select-none">
          JONESAICA
        </p>
      </div>
    </footer>
  );
};
