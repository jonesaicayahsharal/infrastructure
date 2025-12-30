import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { API } from "../App";

const parishes = [
  "Kingston", "St. Andrew", "St. Thomas", "Portland", "St. Mary",
  "St. Ann", "Trelawny", "St. James", "Hanover", "Westmoreland",
  "St. Elizabeth", "Manchester", "Clarendon", "St. Catherine"
];

const interests = [
  { value: "solar", label: "Solar Energy" },
  { value: "electrical", label: "Electrical Services" },
  { value: "plumbing", label: "Plumbing" },
  { value: "carpentry", label: "Carpentry" },
  { value: "quote", label: "Get a Quote" },
  { value: "other", label: "Something Else" },
];

export const CustomerCaptureModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    parish: "",
    district: "",
    interest: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/leads`, formData);
      toast.success("Thank you for your interest! We'll be in touch soon.");
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" data-testid="capture-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg glass rounded-xl p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
          data-testid="close-modal-btn"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="font-heading font-bold text-black text-2xl">J</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">
            Welcome to Jonesaica
          </h2>
          <p className="text-slate-400">
            Let us know how we can help power your future
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded bg-royal-950/50 border border-white/10 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/50 text-white placeholder:text-white/30"
              data-testid="capture-name-input"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded bg-royal-950/50 border border-white/10 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/50 text-white placeholder:text-white/30"
              data-testid="capture-email-input"
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded bg-royal-950/50 border border-white/10 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/50 text-white placeholder:text-white/30"
              data-testid="capture-phone-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="parish"
              required
              value={formData.parish}
              onChange={handleChange}
              className="h-12 px-4 rounded bg-royal-950/50 border border-white/10 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/50 text-white appearance-none parish-select"
              data-testid="capture-parish-select"
            >
              <option value="" className="bg-royal-900">Parish *</option>
              {parishes.map((parish) => (
                <option key={parish} value={parish} className="bg-royal-900">
                  {parish}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="district"
              placeholder="District *"
              required
              value={formData.district}
              onChange={handleChange}
              className="h-12 px-4 rounded bg-royal-950/50 border border-white/10 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/50 text-white placeholder:text-white/30"
              data-testid="capture-district-input"
            />
          </div>

          <div>
            <select
              name="interest"
              required
              value={formData.interest}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded bg-royal-950/50 border border-white/10 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/50 text-white appearance-none parish-select"
              data-testid="capture-interest-select"
            >
              <option value="" className="bg-royal-900">Interested In *</option>
              {interests.map((interest) => (
                <option key={interest.value} value={interest.value} className="bg-royal-900">
                  {interest.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="capture-submit-btn"
          >
            {loading ? "Submitting..." : "Get Started"}
          </button>
        </form>

        <p className="text-slate-500 text-xs text-center mt-4">
          We respect your privacy and will never share your information.
        </p>
      </motion.div>
    </div>
  );
};
