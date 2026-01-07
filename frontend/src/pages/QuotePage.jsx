import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { API } from "../App";
import { CheckCircle } from "lucide-react";

const parishes = [
  "Kingston", "St. Andrew", "St. Thomas", "Portland", "St. Mary",
  "St. Ann", "Trelawny", "St. James", "Hanover", "Westmoreland",
  "St. Elizabeth", "Manchester", "Clarendon", "St. Catherine"
];

const interests = [
  { value: "solar", label: "Solar Installation" },
  { value: "electrical", label: "Electrical Services" },
  { value: "plumbing", label: "Plumbing" },
  { value: "carpentry", label: "Carpentry" },
  { value: "other", label: "Other / Multiple Services" },
];

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    parish: "",
    district: "",
    interest: "",
    products: [],
    specific_needs: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (productId) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/api/quotes`, formData);
      toast.success("Quote request submitted! We'll contact you soon.");
      setSubmitted(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" data-testid="quote-success">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-none text-center max-w-lg mx-4 border border-gold-500/30"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-400" size={40} />
          </div>
          <h2 className="font-heading font-bold text-3xl text-white mb-4">
            Quote Request Submitted!
          </h2>
          <p className="text-royal-400 mb-8">
            Thank you for your interest. Our team will review your request and 
            contact you within 24-48 hours with a detailed quote.
          </p>
          <a href="/" className="btn-gold px-8 py-4 inline-block rounded-none">
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" data-testid="quote-page">
      {/* Header */}
      <section className="py-16 md:py-24 bg-royal-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">
              Free Quote
            </span>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-white mt-4 mb-6">
              REQUEST A QUOTE
            </h1>
            <p className="text-royal-400 text-lg max-w-2xl mx-auto">
              Tell us about your project and we'll provide a detailed, no-obligation quote.
              Our team responds within 24-48 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 md:p-12 rounded-none space-y-8 border border-royal-700/50"
            data-testid="quote-form"
          >
            {/* Contact Information */}
            <div>
              <h3 className="font-heading font-semibold text-xl text-white mb-6">
                Contact Information
              </h3>
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
                    data-testid="quote-name-input"
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
                    data-testid="quote-email-input"
                  />
                </div>

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
                    data-testid="quote-phone-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-royal-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="interest"
                    required
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full h-12 px-4 input-dark rounded-none appearance-none parish-select"
                    data-testid="quote-interest-select"
                  >
                    <option value="" className="bg-royal-900">Select service</option>
                    {interests.map((interest) => (
                      <option key={interest.value} value={interest.value} className="bg-royal-900">
                        {interest.label}
                      </option>
                    ))}
                  </select>
                </div>

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
                    data-testid="quote-parish-select"
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
                    data-testid="quote-district-input"
                  />
                </div>
              </div>
            </div>

            {/* Product Selection */}
            {(formData.interest === "solar" || formData.interest === "") && products.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold text-xl text-white mb-4">
                  Interested in Specific Products? (Optional)
                </h3>
                <p className="text-royal-400 text-sm mb-4">
                  Select any products you're interested in for your quote
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border ${
                        formData.products.includes(product.id)
                          ? "bg-gold-500/20 border-gold-500/50"
                          : "bg-royal-800/30 border-royal-700 hover:bg-royal-800/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.products.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 rounded-none flex items-center justify-center flex-shrink-0 ${
                          formData.products.includes(product.id)
                            ? "bg-gold-500"
                            : "bg-royal-700"
                        }`}
                      >
                        {formData.products.includes(product.id) && (
                          <CheckCircle className="text-royal-950" size={14} />
                        )}
                      </div>
                      <span className="text-sm text-royal-300 line-clamp-1">
                        {product.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Specific Needs */}
            <div>
              <label className="block text-sm font-medium text-royal-300 mb-2">
                Describe Your Specific Needs *
              </label>
              <textarea
                name="specific_needs"
                rows={4}
                required
                value={formData.specific_needs}
                onChange={handleChange}
                className="w-full px-4 py-3 input-dark rounded-none resize-none"
                placeholder="Tell us about your project: property type, size, current setup, specific requirements..."
                data-testid="quote-description-input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-4 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="quote-submit-btn"
            >
              {loading ? "Submitting..." : "Submit Quote Request"}
            </button>

            <p className="text-royal-500 text-sm text-center">
              We'll review your request and respond within 24-48 hours with a detailed quote.
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
