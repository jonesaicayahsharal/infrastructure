import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, HardHat, Hammer, Layers } from "lucide-react";
import { ContactForm } from "../../components/ContactForm";

const services = [
  "Structural steel fabrication",
  "Foundation steel & rebar caging",
  "Columns & beams",
  "Decking & slab preparation",
  "Staircases & railings",
  "Mezzanine & upper-floor steel",
  "Welding & reinforcement",
  "On-site steel installation",
];

const steelApplications = [
  "Residential construction",
  "Commercial buildings",
  "Extensions & upper floors",
  "Load-bearing reinforcements",
  "Custom structural solutions",
];

export default function SteelWorkPage() {
  return (
    <div className="min-h-screen pt-20" data-testid="steelwork-service-page">
      
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200"
            alt="Steel construction work"
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
            <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 border border-gold-500/30 mb-6">
              <HardHat size={20} />
              <span className="font-medium">Steel Work</span>
            </div>

            <h1 className="font-heading font-black text-4xl md:text-6xl text-white mb-6">
              STRUCTURAL<br />
              <span className="text-gold-400">STEEL SOLUTIONS</span>
            </h1>

            <p className="text-royal-300 text-lg mb-8">
              Comprehensive steel work from foundation to upper levels.
              We design, fabricate, and install steel structures built for strength,
              safety, and long-term durability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quote" className="btn-gold px-8 py-4 text-center rounded-none">
                Get Free Quote
              </Link>
              <a href="tel:+18768422916" className="btn-outline px-8 py-4 text-center rounded-none">
                Call: (876) 842-2916
              </a>
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
                Our Steel Work Services
              </h2>
              <p className="text-royal-400 mb-8">
                From groundwork reinforcement to full upper-floor steel framing,
                our steel work ensures your structure is solid, compliant,
                and engineered to carry load safely.
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
                    <CheckCircle className="text-gold-500 flex-shrink-0" size={18} />
                    <span className="text-royal-300 text-sm">{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-none border border-royal-700/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gold-500/10 border border-gold-500/30">
                    <Layers className="text-gold-400" size={24} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white">
                    Structural Applications
                  </h3>
                </div>

                <ul className="space-y-2">
                  {steelApplications.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-royal-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-none border border-royal-700/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gold-500/10 border border-gold-500/30">
                    <Hammer className="text-gold-400" size={24} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white">
                    Fabrication & Installation
                  </h3>
                </div>

                <p className="text-royal-400 text-sm">
                  Precision fabrication, welding, and secure on-site
                  installation to ensure your steel work integrates perfectly
                  with concrete and masonry systems.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Need Steel Work?
            </h2>
            <p className="text-royal-400">
              Contact us for a free quote on your steel construction project
            </p>
          </div>
          <div className="glass-card p-8 rounded-none border border-royal-700/50">
            <ContactForm />
          </div>
        </div>
      </section>

    </div>
  );
}

