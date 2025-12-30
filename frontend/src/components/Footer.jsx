import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

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
    <footer className="bg-royal-950 border-t border-white/5" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gold-400 flex items-center justify-center">
                <span className="font-heading font-bold text-black text-xl">J</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Jonesaica
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Powering Jamaica, Building the Future. Quality solar solutions and building services across the island.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-gold-400 hover:text-black text-slate-400 rounded transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-gold-400 hover:text-black text-slate-400 rounded transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-gold-400 hover:text-black text-slate-400 rounded transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-gold-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">+1 (876) 842-2916</p>
                  <p className="text-slate-500 text-sm">Mon-Sat 8am-6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gold-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-400">Greenwood/Lilliput District</p>
                  <p className="text-slate-400">St. James, Jamaica</p>
                  <p className="text-slate-500 text-sm">Serving Island-Wide</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {currentYear} Jonesaica Infrastructure Solutions. All rights reserved.
            </p>
            <p className="text-slate-600 text-sm">
              Serving Trelawny, St. James & Island-Wide
            </p>
          </div>
        </div>
      </div>

      {/* Giant Logo Section */}
      <div className="border-t border-white/5 py-12 overflow-hidden">
        <p className="font-heading font-bold text-[8rem] md:text-[12rem] lg:text-[16rem] text-white/[0.02] text-center leading-none select-none">
          JONESAICA
        </p>
      </div>
    </footer>
  );
};
