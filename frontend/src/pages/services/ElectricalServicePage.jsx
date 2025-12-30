import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Zap, Home, Building } from "lucide-react";
import { ContactForm } from "../../components/ContactForm";

const services = [
  "Residential wiring & rewiring",
  "Commercial electrical installations",
  "Electrical panel upgrades",
  "Lighting installations",
  "Outlet & switch installations",
  "Electrical repairs & troubleshooting",
  "Safety inspections",
  "Generator installations",
];

const projects = [
  {
    title: "Residential",
    icon: Home,
    items: [
      "New home wiring",
      "Rewiring older homes",
      "Ceiling fan installations",
      "Security lighting",
      "Smart home setups",
    ],
  },
  {
    title: "Commercial",
    icon: Building,
    items: [
      "Office electrical systems",
      "Retail store lighting",
      "Industrial wiring",
      "Emergency lighting",
      "Maintenance contracts",
    ],
  },
];

export default function ElectricalServicePage() {
  return (
    <div className="min-h-screen pt-20" data-testid="electrical-service-page">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/27928761/pexels-photo-27928761.jpeg"
            alt="Electrical work"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-royal-950 via-royal-950/95 to-royal-950/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-gold-400/20 text-gold-400 px-4 py-2 rounded-full mb-6">
              <Zap size={20} />
              <span className="font-medium">Electrical Services</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6">
              Professional<br />
              <span className="text-gold-gradient">Electrical Work</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Safe, reliable electrical services for homes and businesses across Jamaica.
              From simple repairs to complete installations, our licensed electricians
              deliver quality workmanship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quote" className="btn-primary px-8 py-4 text-center">
                Get Free Quote
              </Link>
              <Link to="/contact" className="btn-secondary px-8 py-4 text-center">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
                Our Electrical Services
              </h2>
              <p className="text-slate-400 mb-8">
                Whether you need a simple outlet installed or complete electrical 
                work for a new building, we have the expertise to handle it. 
                Safety and quality are our top priorities.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-gold-400 flex-shrink-0" size={18} />
                    <span className="text-slate-300 text-sm">{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gold-400/10 rounded-lg">
                      <project.icon className="text-gold-400" size={24} />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-white">
                      {project.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {project.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety Note */}
      <section className="py-16 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="glass p-8 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-gold-400/10 rounded-full">
                <Zap className="text-gold-400" size={48} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl text-white mb-2">
                  Safety First
                </h3>
                <p className="text-slate-400">
                  Electrical work is not DIY territory. Poor electrical work can cause fires, 
                  shocks, and costly damage. Our team follows strict safety protocols and 
                  ensures all work meets or exceeds local codes and standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Need Electrical Work?
            </h2>
            <p className="text-slate-400">
              Contact us for a free assessment and quote
            </p>
          </div>
          <div className="glass p-8 rounded-xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
