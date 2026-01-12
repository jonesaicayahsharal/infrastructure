import { useState } from "react";
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
  { value: "quote", label: "Get a Quote" },
  { value: "other", label: "Other" },
];

export const ContactForm = ({ className = "" }) => {
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

  console.log("🔥 CONTACT FORM SUBMIT FIRED", formData);

  setLoading(true);

  try {
    await axios.post(
      "https://infrastructure-production-cc30.up.railway.app/api/leads",
      formData
    );
    console.log("✅ AXIOS POST RESOLVED");
    toast.success("Message sent! We'll get back to you soon.");
} catch (error) {
    console.error("❌ AXIOS ERROR", error);
    toast.error("Something went wrong. Please try again.");
} finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`} data-testid="contact-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-royal-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none"
            placeholder="Your full name"
            data-testid="contact-name-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-royal-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none"
            placeholder="your@email.com"
            data-testid="contact-email-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-royal-300 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none"
            placeholder="(876) 000-0000"
            data-testid="contact-phone-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-royal-300 mb-2">
            Interested In *
          </label>
          <select
            name="interest"
            required
            value={formData.interest}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none appearance-none parish-select"
            data-testid="contact-interest-select"
          >
            <option value="" className="bg-royal-900">Select an option</option>
            {interests.map((interest) => (
              <option key={interest.value} value={interest.value} className="bg-royal-900">
                {interest.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-royal-300 mb-2">
            Parish *
          </label>
          <select
            name="parish"
            required
            value={formData.parish}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none appearance-none parish-select"
            data-testid="contact-parish-select"
          >
            <option value="" className="bg-royal-900">Select parish</option>
            {parishes.map((parish) => (
              <option key={parish} value={parish} className="bg-royal-900">
                {parish}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-royal-300 mb-2">
            District *
          </label>
          <input
            type="text"
            name="district"
            required
            value={formData.district}
            onChange={handleChange}
            className="w-full h-12 px-4 input-dark rounded-none"
            placeholder="Your district"
            data-testid="contact-district-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-royal-300 mb-2">
          Describe Your Specific Needs
        </label>
        <textarea
          name="specific_needs"
          rows={4}
          value={formData.specific_needs}
          onChange={handleChange}
          className="w-full px-4 py-3 input-dark rounded-none resize-none"
          placeholder="Tell us about your project or inquiry..."
          data-testid="contact-message-input"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto btn-gold px-12 py-4 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="contact-submit-btn"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};
