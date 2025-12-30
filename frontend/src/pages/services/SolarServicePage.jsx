import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Sun, Battery, Zap, ArrowRight } from "lucide-react";
import { ContactForm } from "../../components/ContactForm";

const features = [
  "Complete system design & engineering",
  "Premium inverters (Deye 6kW-12kW)",
  "LiFePO4 battery storage solutions",
  "High-efficiency bi-facial panels",
  "Professional installation",
  "System monitoring setup",
  "Maintenance & support",
  "Warranty coverage",
];

const packages = [
  {
    name: "Starter Solar",
    description: "Perfect for smaller homes with basic energy needs",
    components: ["6kW Deye Inverter", "5kWh Battery", "4x 450W Panels"],
    ideal: "1-2 bedroom homes",
  },
  {
    name: "Home Solar",
    description: "Ideal for medium-sized homes with moderate usage",
    components: ["8kW Deye Inverter", "10kWh Battery", "8x 450W Panels"],
    ideal: "3-4 bedroom homes",
  },
  {
    name: "Premium Solar",
    description: "Complete energy independence for larger properties",
    components: ["12kW Deye Inverter", "16kWh Battery", "12x 545W Panels"],
    ideal: "Large homes & small businesses",
  },
];

export default function SolarServicePage() {
  return (
    <div className="min-h-screen pt-20" data-testid="solar-service-page">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/9875423/pexels-photo-9875423.jpeg"
            alt="Solar installation"
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
              <Sun size={20} />
              <span className="font-medium">Solar Energy Solutions</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6">
              Power Your Home with<br />
              <span className="text-gold-gradient">Clean Energy</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Professional solar installation services across Jamaica. Save money, 
              reduce your carbon footprint, and achieve energy independence with 
              premium equipment at competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quote" className="btn-primary px-8 py-4 text-center">
                Get Free Solar Quote
              </Link>
              <Link to="/products" className="btn-secondary px-8 py-4 text-center">
                View Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
                Complete Solar Solutions
              </h2>
              <p className="text-slate-400 mb-8">
                From initial consultation to final installation and ongoing support, 
                we handle every aspect of your solar project. Our team ensures you 
                get the right system for your needs and budget.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-gold-400 flex-shrink-0" size={18} />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-xl text-center">
                <Zap className="text-gold-400 mx-auto mb-4" size={40} />
                <p className="text-3xl font-bold text-white mb-2">6-12kW</p>
                <p className="text-slate-400 text-sm">Inverter Options</p>
              </div>
              <div className="glass p-6 rounded-xl text-center">
                <Battery className="text-gold-400 mx-auto mb-4" size={40} />
                <p className="text-3xl font-bold text-white mb-2">5-16kWh</p>
                <p className="text-slate-400 text-sm">Battery Storage</p>
              </div>
              <div className="glass p-6 rounded-xl text-center col-span-2">
                <Sun className="text-gold-400 mx-auto mb-4" size={40} />
                <p className="text-3xl font-bold text-white mb-2">450-545W</p>
                <p className="text-slate-400 text-sm">High-Efficiency Panels</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Solar Packages
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Pre-designed packages to suit different needs. Custom configurations also available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-xl"
              >
                <h3 className="font-heading font-bold text-xl text-white mb-2">
                  {pkg.name}
                </h3>
                <p className="text-slate-400 text-sm mb-6">{pkg.description}</p>
                
                <div className="space-y-3 mb-6">
                  {pkg.components.map((component) => (
                    <div key={component} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="text-gold-400" size={16} />
                      <span className="text-sm">{component}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gold-400 text-sm mb-6">
                  Ideal for: {pkg.ideal}
                </p>

                <Link
                  to="/quote"
                  className="flex items-center justify-center gap-2 w-full btn-secondary py-3"
                >
                  Get Quote <ArrowRight size={18} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Ready to Go Solar?
            </h2>
            <p className="text-slate-400">
              Contact us for a free consultation and quote
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
