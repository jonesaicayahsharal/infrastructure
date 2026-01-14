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
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical Services" },
  { value: "carpentry", label: "Carpentry" },
  { value: "steel", label: "Steel Work" },
  { value: "quote", label: "Get a Quote" },
  { value: "other", label: "Other" },
];

export const LeadCaptureModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    parish: "",
    district: "",
    interest: "",
    specific_needs: "",
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
      toast.success("Thank you! We'll be in touch soon.");
      onClose(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" data-testid="lead-capture-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg glass-card rounded-none p-8 border border-gold-500/30"
      >
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-royal-400 hover:text-gold-400 transition-colors"
          data-testid="close-modal-btn"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl text-white mb-2">
            JONESAICA
          </h2>
          <p className="text-gold-400 font-medium tracking-wide text-sm uppercase">
            Infrastructure Solutions
          </p>
          <p className="text-royal-300 mt-4">
            Tell us what you need and we'll reach out to help
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none"
            data-testid="modal-name-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none"
            data-testid="modal-email-input"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none"
            data-testid="modal-phone-input"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="parish"
              required
              value={formData.parish}
              onChange={handleChange}
              className="h-12 px-4 input-dark rounded-none appearance-none parish-select"
              data-testid="modal-parish-select"
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
              className="h-12 px-4 input-dark rounded-none"
              data-testid="modal-district-input"
            />
          </div>

          <select
            name="interest"
            required
            value={formData.interest}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none appearance-none parish-select"
            data-testid="modal-interest-select"
          >
            <option value="" className="bg-royal-900">Interested In *</option>
            {interests.map((interest) => (
              <option key={interest.value} value={interest.value} className="bg-royal-900">
                {interest.label}
              </option>
            ))}
          </select>

          <textarea
            name="specific_needs"
            rows={3}
            placeholder="Describe your specific needs..."
            value={formData.specific_needs}
            onChange={handleChange}
            className="w-full px-4 py-3 input-dark rounded-none resize-none"
            data-testid="modal-needs-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-4 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="modal-submit-btn"
          >
            {loading ? "Submitting..." : "Get Started"}
          </button>
        </form>

        <p className="text-royal-500 text-xs text-center mt-4">
          Your information is secure and will never be shared.
        </p>
      </motion.div>
    </div>
  );
};
