import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Hammer, TreeDeciduous, Home } from "lucide-react";
import { ContactForm } from "../../components/ContactForm";

const services = [
  "Custom decking & patios",
  "Animal shelters & pens",
  "Door jam repairs & installations",
  "Door installation & hanging",
  "Wooden structures & gazebos",
  "Fence building",
  "Repair & restoration",
  "Custom woodwork projects",
];

const projects = [
  {
    title: "Decking & Outdoor",
    icon: TreeDeciduous,
    description: "Beautiful, durable outdoor living spaces",
    items: [
      "Wooden deck construction",
      "Patio covers",
      "Pergolas & gazebos",
      "Outdoor furniture",
    ],
  },
  {
    title: "Animal Structures",
    icon: Home,
    description: "Safe, sturdy shelters for your animals",
    items: [
      "Chicken coops",
      "Dog kennels",
      "Goat pens",
      "Livestock shelters",
    ],
  },
  {
    title: "Doors & Frames",
    icon: Hammer,
    description: "Professional door services",
    items: [
      "Door jam repair",
      "New door installation",
      "Frame reconstruction",
      "Hardware fitting",
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
            src="https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg"
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
            <div className="inline-flex items-center gap-2 bg-gold-400/20 text-gold-400 px-4 py-2 rounded-full mb-6">
              <Hammer size={20} />
              <span className="font-medium">Carpentry Services</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6">
              Quality<br />
              <span className="text-gold-gradient">Woodwork</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Expert carpentry services for all your building needs. From beautiful 
              decks to functional animal shelters, we craft structures built to last
              in Jamaica's climate.
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
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Our Carpentry Services
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From small repairs to major construction projects, our skilled 
              carpenters deliver quality craftsmanship every time.
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
                className="flex items-center gap-3 glass p-4 rounded-lg"
              >
                <CheckCircle className="text-gold-400 flex-shrink-0" size={18} />
                <span className="text-slate-300 text-sm">{service}</span>
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
                className="glass p-8 rounded-xl"
              >
                <div className="p-3 bg-gold-400/10 rounded-lg inline-block mb-4">
                  <project.icon className="text-gold-400" size={32} />
                </div>
                <h3 className="font-heading font-semibold text-xl text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{project.description}</p>
                <ul className="space-y-2">
                  {project.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
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
              <p className="text-slate-400 mb-6">
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
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="text-gold-400" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass p-8 rounded-xl">
              <h3 className="font-heading font-semibold text-xl text-white mb-4">
                Popular Projects
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-medium">Wooden Deck (200 sq ft)</p>
                  <p className="text-slate-400 text-sm">Perfect for outdoor entertaining</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-medium">Chicken Coop (8-12 birds)</p>
                  <p className="text-slate-400 text-sm">Secure, easy-to-clean design</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-medium">Door Installation</p>
                  <p className="text-slate-400 text-sm">Interior or exterior doors</p>
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
