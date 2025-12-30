import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const ServiceCard = ({ service, index = 0, size = "normal" }) => {
  const isLarge = size === "large";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`service-card glass-card rounded-none overflow-hidden group border border-royal-700/50 ${
        isLarge ? "md:col-span-2 md:row-span-2" : ""
      }`}
      data-testid={`service-card-${service.slug}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isLarge ? "aspect-[16/9]" : "aspect-video"}`}>
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-royal-950/30 to-transparent" />
        
        {/* Icon */}
        <div className="absolute top-4 left-4 p-3 glass rounded-none border border-gold-500/30">
          <service.icon className="w-6 h-6 text-gold-400" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={`font-heading font-bold text-white mb-3 ${isLarge ? "text-2xl" : "text-xl"}`}>
          {service.title}
        </h3>
        <p className={`text-royal-400 mb-4 ${isLarge ? "text-base" : "text-sm"} line-clamp-3`}>
          {service.description}
        </p>

        <Link
          to={service.path}
          className="inline-flex items-center gap-2 text-gold-400 font-medium hover:gap-3 transition-all"
          data-testid={`service-link-${service.slug}`}
        >
          Learn More <ArrowRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
};
