import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Wrench, Droplets, ShowerHead } from "lucide-react";
import { ContactForm } from "../../components/ContactForm";

const services = [
  "Pipe installation & repairs",
  "Leak detection & repair",
  "Water heater installation",
  "Bathroom fixtures",
  "Kitchen plumbing",
  "Drain cleaning",
  "Septic systems",
  "Water tank installations",
];

const emergencyServices = [
  "Burst pipes",
  "Blocked drains",
  "Overflowing toilets",
  "No water pressure",
  "Leaking water heaters",
];

export default function PlumbingServicePage() {
  return (
    <div className="min-h-screen pt-20" data-testid="plumbing-service-page">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7220892/pexels-photo-7220892.jpeg"
            alt="Plumbing work"
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
              <Wrench size={20} />
              <span className="font-medium">Plumbing Services</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6">
              Expert<br />
              <span className="text-gold-gradient">Plumbing Solutions</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Professional plumbing services for installations, repairs, and maintenance.
              From fixing leaks to complete bathroom renovations, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quote" className="btn-primary px-8 py-4 text-center">
                Get Free Quote
              </Link>
              <a href="tel:+18768422916" className="btn-secondary px-8 py-4 text-center">
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
                Our Plumbing Services
              </h2>
              <p className="text-slate-400 mb-8">
                Whether it's a dripping faucet or a complete plumbing system installation, 
                our experienced plumbers deliver reliable, lasting solutions. We work on 
                residential and commercial properties across Jamaica.
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
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gold-400/10 rounded-lg">
                    <ShowerHead className="text-gold-400" size={24} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white">
                    Bathroom & Kitchen
                  </h3>
                </div>
                <ul className="space-y-2">
                  {["Sink installations", "Toilet repairs & replacement", "Shower installations", "Faucet repairs"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
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
                className="glass p-6 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gold-400/10 rounded-lg">
                    <Droplets className="text-gold-400" size={24} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white">
                    Water Systems
                  </h3>
                </div>
                <ul className="space-y-2">
                  {["Water tank installation", "Pump systems", "Pressure issues", "Main line repairs"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="glass p-8 md:p-12 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
                  Plumbing Emergency?
                </h2>
                <p className="text-slate-400 mb-6">
                  Water damage doesn't wait. If you have a plumbing emergency, 
                  call us immediately. We respond quickly to minimize damage 
                  and get your plumbing back in working order.
                </p>
                <a
                  href="tel:+18768422916"
                  className="inline-block btn-primary px-8 py-4"
                >
                  Call Now: (876) 842-2916
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Common Emergencies:</h3>
                <ul className="space-y-3">
                  {emergencyServices.map((service) => (
                    <li key={service} className="flex items-center gap-3 text-slate-300">
                      <Wrench className="text-gold-400" size={18} />
                      {service}
                    </li>
                  ))}
                </ul>
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
              Need Plumbing Help?
            </h2>
            <p className="text-slate-400">
              Contact us for a free quote on your plumbing project
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
