import { motion } from "framer-motion";
import { Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20" data-testid="contact-page">
      {/* Header */}
      <section className="py-16 md:py-24 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
              Get In Touch
            </span>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-white mt-4 mb-6">
              CONTACT US
            </h1>
            <p className="text-royal-400 text-lg max-w-2xl mx-auto">
              Have questions about our services or products? Ready to start your project?
              Reach out and let's discuss how we can help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 rounded-none border border-royal-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-500/10 rounded-none border border-gold-500/30">
                    <Phone className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-white mb-2">Phone</h3>
                    <p className="text-royal-400">+1-876-842-2916</p>
                    <p className="text-royal-500 text-sm mt-1">Call or WhatsApp</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-none border border-royal-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-500/10 rounded-none border border-gold-500/30">
                    <MapPin className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-white mb-2">Location</h3>
                    <p className="text-royal-400">Greenwood/Lilliput District</p>
                    <p className="text-royal-400">St. James, Jamaica</p>
                    <p className="text-royal-500 text-sm mt-1">
                      Serving Trelawny–St. James & Island-Wide
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-none border border-royal-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-500/10 rounded-none border border-gold-500/30">
                    <Clock className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-white mb-2">Hours</h3>
                    <p className="text-royal-400">Monday - Saturday</p>
                    <p className="text-royal-400">8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </motion.div>

              {/* Service Areas */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 rounded-none border border-royal-700/50"
              >
                <h3 className="font-heading font-semibold text-white mb-4">
                  Service Areas
                </h3>
                <p className="text-royal-400 text-sm mb-4">
                  Based in St. James, we provide services across Jamaica:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["St. James", "Trelawny", "Hanover", "Westmoreland", "St. Ann", "All Parishes"].map(
                    (area) => (
                      <span
                        key={area}
                        className="px-3 py-1 text-xs bg-royal-800/50 text-royal-300 border border-royal-700"
                      >
                        {area}
                      </span>
                    )
                  )}
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass-card p-8 rounded-none border border-royal-700/50"
            >
              <h2 className="font-heading font-bold text-2xl text-white mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
