import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Hammer, Home, Building2 } from "lucide-react";
import { ContactForm } from "../../components/ContactForm";

// CORRECTED: Decking = roof prep, slab work, ceiling beams - NOT patios/gazebos
const services = [
  "Roof prep & decking (slab work)",
  "Ceiling beam installation",
  "Roof framing & trusses",
  "Animal pens & shelters",
  "Door jams & door installation",
  "Board housing construction",
  "Basic housing structures",
  "Fence building & repairs",
];

const projects = [
  {
    title: "Structural Carpentry",
    icon: Building2,
    description: "Foundation & roof work for buildings",
    items: [
      "Roof decking (slab preparation)",
      "Ceiling beam installation",
      "Roof framing & trusses",
      "Floor joist systems",
      "Structural supports",
    ],
  },
  {
    title: "Animal Structures",
    icon: Home,
    description: "Safe, sturdy shelters for your animals",
    items: [
      "Chicken coops",
      "Goat pens",
      "Dog kennels",
      "Livestock shelters",
      "Feed storage structures",
    ],
  },
  {
    title: "Housing & Doors",
    icon: Hammer,
    description: "Residential carpentry work",
    items: [
      "Door jam repair/installation",
      "New door hanging",
      "Board house construction",
      "Board shop structures",
      "Basic housing frames",
    ],
  },
];

export default function CarpentryServicePage() {
  return (
    <div className="min-h-screen pt-20" data-testid="carpentry-service-page">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200"
            alt="Carpentry work"
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
              <Hammer size={20} />
              <span className="font-medium">Carpentry Services</span>
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-white mb-6">
              QUALITY<br />
              <span className="text-gold-400">CARPENTRY WORK</span>
            </h1>
            <p className="text-royal-300 text-lg mb-8">
              Expert carpentry services for all your building needs. Roof decking, 
              ceiling beams, animal pens, door installations, and board housing. 
              Built to last in Jamaica's climate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quote" className="btn-gold px-8 py-4 text-center rounded-none">
                Get Free Quote
              </Link>
              <Link to="/contact" className="btn-outline px-8 py-4 text-center rounded-none">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Our Carpentry Services
            </h2>
            <p className="text-royal-400 max-w-2xl mx-auto">
              From roof preparation to animal shelters, we deliver quality 
              craftsmanship for all your carpentry needs.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 glass-card p-4 rounded-none border border-royal-700/50"
              >
                <CheckCircle className="text-gold-500 flex-shrink-0" size={18} />
                <span className="text-royal-300 text-sm">{service}</span>
              </motion.div>
            ))}
          </div>

          {/* Project Types */}
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-none border border-royal-700/50"
              >
                <div className="p-3 bg-gold-500/10 rounded-none border border-gold-500/30 inline-block mb-4">
                  <project.icon className="text-gold-400" size={32} />
                </div>
                <h3 className="font-heading font-semibold text-xl text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-royal-400 text-sm mb-4">{project.description}</p>
                <ul className="space-y-2">
                  {project.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-royal-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl text-white mb-6">
                Built to Last
              </h2>
              <p className="text-royal-400 mb-6">
                We understand Jamaica's climate presents unique challenges. That's why 
                we use treated lumber and proven construction techniques to ensure 
                your structures withstand the elements year after year.
              </p>
              <ul className="space-y-4">
                {[
                  "Weather-resistant materials",
                  "Proper drainage design",
                  "Treated wood for longevity",
                  "Quality hardware & fasteners",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-royal-300">
                    <CheckCircle className="text-gold-500" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-8 rounded-none border border-royal-700/50">
              <h3 className="font-heading font-semibold text-xl text-white mb-4">
                Popular Projects
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-royal-800/30 border border-royal-700">
                  <p className="text-white font-medium">Roof Decking & Slab Prep</p>
                  <p className="text-royal-400 text-sm">Foundation for concrete roof work</p>
                </div>
                <div className="p-4 bg-royal-800/30 border border-royal-700">
                  <p className="text-white font-medium">Chicken Coop (8-12 birds)</p>
                  <p className="text-royal-400 text-sm">Secure, easy-to-clean design</p>
                </div>
                <div className="p-4 bg-royal-800/30 border border-royal-700">
                  <p className="text-white font-medium">Door Jam & Installation</p>
                  <p className="text-royal-400 text-sm">Interior or exterior doors</p>
                </div>
                <div className="p-4 bg-royal-800/30 border border-royal-700">
                  <p className="text-white font-medium">Board House/Shop Structure</p>
                  <p className="text-royal-400 text-sm">Basic housing frame construction</p>
                </div>
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
              Start Your Project
            </h2>
            <p className="text-royal-400">
              Contact us for a free consultation and quote
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
