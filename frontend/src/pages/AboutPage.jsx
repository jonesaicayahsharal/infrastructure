import { motion } from "framer-motion";
import { CheckCircle, Users, Award, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import rickyMixBoard from "../assets/images/ricky-mix-board.jpg";


const values = [
  {
    icon: Award,
    title: "Quality First",
    description: "We use only premium products and materials, ensuring long-lasting results for every project.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description: "Your satisfaction is our priority. We work closely with you to understand and exceed your expectations.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description: "Based in St. James, we understand Jamaica's unique needs and provide island-wide service.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20" data-testid="about-page">
      {/* Header */}
      <section className="py-16 md:py-24 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
              About Us
            </span>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-white mt-4 mb-6">
              JONESAICA INFRASTRUCTURE
            </h1>
            <p className="text-royal-400 text-lg max-w-3xl mx-auto">
              Building Jamaica's Future. Your trusted partner for 
              solar energy, electrical, plumbing, steel work, and carpentry services across the island.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-royal-400">
                <p>
                  Jonesaica Infrastructure Solutions was founded with a simple mission: 
                  to bring quality infrastructure services to Jamaican homes and businesses 
                  at competitive prices.
                </p>
                <p>
                  Based in the Greenwood/Lilliput District of St. James, we serve the 
                  Trelawny and St. James borders as our primary service area, while 
                  offering island-wide services depending on the project scope.
                </p>
                <p>
                  We specialize in solar energy solutions, providing top-quality inverters, 
                  batteries, and panels at prices that beat the local competition. Beyond 
                  solar, we offer comprehensive building services including electrical work, 
                  plumbing, steel work, and carpentry.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src={rickyMixBoard}
                alt="Jonesaica team at work"
                className="rounded-none border border-royal-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 rounded-none text-center border border-royal-700/50"
              >
                <div className="inline-flex p-4 bg-gold-500/10 rounded-none border border-gold-500/30 mb-6">
                  <value.icon className="text-gold-400" size={32} />
                </div>
                <h3 className="font-heading font-semibold text-xl text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-royal-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              What We Offer
            </h2>
            <p className="text-royal-400 max-w-2xl mx-auto">
              Comprehensive infrastructure solutions for residential and commercial properties
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-none border border-royal-700/50">
              <h3 className="font-heading font-semibold text-xl text-white mb-4">
                Solar Energy Solutions
              </h3>
              <ul className="space-y-3">
                {[
                  "Hybrid Inverters (6kW - 12kW)",
                  "LiFePO4 Batteries (5kWh - 16kWh)",
                  "Bi-Facial Solar Panels",
                  "Complete System Installation",
                  "Maintenance & Support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-royal-400">
                    <CheckCircle className="text-gold-500 flex-shrink-0" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-8 rounded-none border border-royal-700/50">
              <h3 className="font-heading font-semibold text-xl text-white mb-4">
                Building Services
              </h3>
              <ul className="space-y-3">
                {[
                  "Electrical Installations & Repairs",
                  "Plumbing - Installations & Maintenance",
                  "Carpentry - Roof Prep, Ceiling Beams, Slab Work",
                  "Animal Pens & Shelters",
                  "Door Jams & Door Installation",
                  "Steel Work - Column, Beams, Caging and Decking",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-royal-400">
                    <CheckCircle className="text-gold-500 flex-shrink-0" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-royal-400 text-lg mb-8 max-w-2xl mx-auto">
            Whether you need solar installation, electrical work, or building services,
            we're here to help. Contact us today for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="btn-gold px-8 py-4 text-center rounded-none"
              data-testid="about-quote-btn"
            >
              Get Free Quote
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-8 py-4 text-center rounded-none"
              data-testid="about-contact-btn"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
