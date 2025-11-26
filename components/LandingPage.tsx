"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Check,
  Calendar,
  Users,
  Shield,
  Award,
  Zap,
  Star,
} from "lucide-react";

interface Package {
  id: number;
  title: string;
  price: string;
  image: string;
  date: string;
}

interface AddOn {
  title: string;
  image: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showToast, setShowToast] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const packages: Package[] = [
    {
      id: 1,
      title: "F1 Monaco Grand Prix",
      price: "$4,999",
      image:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop",
      date: "May 2025",
    },
    {
      id: 2,
      title: "FIFA World Cup Finals",
      price: "$6,499",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop",
      date: "July 2026",
    },
    {
      id: 3,
      title: "Wimbledon Championships",
      price: "$3,299",
      image:
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop",
      date: "June 2025",
    },
    {
      id: 4,
      title: "Super Bowl Experience",
      price: "$5,799",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop",
      date: "Feb 2026",
    },
  ];

  const addOns: AddOn[] = [
    {
      title: "VIP Stadium Tours",
      image:
        "https://images.unsplash.com/photo-1508768787810-6adc1f613514?w=600&h=400&fit=crop",
    },
    {
      title: "Meet & Greet Athletes",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop",
    },
    {
      title: "Luxury Transportation",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
    },
    {
      title: "Fine Dining Experiences",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    },
  ];

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  //   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();
  //     const newErrors = validateForm();

  //     if (Object.keys(newErrors).length === 0) {
  //       // Simulate API call
  //       try {
  //         // await fetch('/api/leads', {
  //         //   method: 'POST',
  //         //   headers: { 'Content-Type': 'application/json' },
  //         //   body: JSON.stringify(formData)
  //         // });

  //         setShowToast(true);
  //         setShowForm(false);
  //         setFormData({ name: '', email: '', phone: '', message: '' });
  //         setErrors({});
  //         setTimeout(() => setShowToast(false), 3000);
  //       } catch (error) {
  //         console.error('Error submitting form:', error);
  //       }
  //     } else {
  //       setErrors(newErrors);
  //     }
  //   };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        // Send to backend API
        const response = await fetch("http://localhost:5000/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setShowToast(true);
          setShowForm(false);
          setFormData({ name: "", email: "", phone: "", message: "" });
          setErrors({});
          setTimeout(() => setShowToast(false), 3000);
        } else {
          alert(data.message || "Something went wrong!");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit. Please try again.");
      }
    } else {
      setErrors(newErrors);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">SportTravel</div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("packages")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              Packages
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              About
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Contact Us
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection("packages")}
                className="block hover:text-blue-600 cursor-pointer w-full text-left"
              >
                Packages
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block hover:text-blue-600 cursor-pointer w-full text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block hover:text-blue-600 cursor-pointer w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => {
                  setShowForm(true);
                  setIsMenuOpen(false);
                }}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=1080&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Experience Sports Like Never Before
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Premium travel packages to the world's most iconic sporting events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
            >
              Plan My Trip
            </button>
            <button
              onClick={() => scrollToSection("packages")}
              className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
            >
              View Packages
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white" id="about">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield size={40} />,
                number: "10K+",
                label: "Happy Travelers",
              },
              {
                icon: <Award size={40} />,
                number: "500+",
                label: "Events Covered",
              },
              {
                icon: <Users size={40} />,
                number: "24/7",
                label: "Support Available",
              },
              {
                icon: <Star size={40} />,
                number: "4.9",
                label: "Average Rating",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-lg hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <div className="text-blue-600 flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Packages */}
      <section className="py-20 bg-gray-50" id="packages">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Top Packages</h2>
          <p className="text-center text-gray-600 mb-12">
            Exclusive access to the world's greatest sporting events
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {pkg.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {pkg.price}
                    </span>
                    <span className="text-sm text-gray-500">per person</span>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop"
                  alt="F1 Japan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-12 text-white flex flex-col justify-center">
                <div className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                  Featured Event
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  F1 Japanese Grand Prix
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Experience the thrill of Formula 1 at the legendary Suzuka
                  Circuit. Premium hospitality, pit lane access, and VIP
                  experiences included.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} />
                    <span>April 2025</span>
                  </div>
                  <div className="text-2xl font-bold">$7,999</div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition w-fit"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Choose Your Event",
                desc: "Browse our curated selection of premium sporting events worldwide",
                icon: <Calendar size={40} />,
              },
              {
                step: "02",
                title: "Customize Your Package",
                desc: "Select accommodations, tickets, and exclusive add-ons",
                icon: <Zap size={40} />,
              },
              {
                step: "03",
                title: "Travel & Enjoy",
                desc: "We handle all logistics while you create unforgettable memories",
                icon: <Check size={40} />,
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.icon}
                </div>
                <div className="text-blue-600 font-bold text-sm mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Exclusive Add-Ons
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Enhance your experience with premium upgrades
          </p>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6" style={{ width: "max-content" }}>
              {addOns.map((addon, i) => (
                <div
                  key={i}
                  className="w-80 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={addon.image}
                      alt={addon.title}
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{addon.title}</h3>
                    <button
                      onClick={() => setShowForm(true)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">
                SportTravel
              </div>
              <p className="text-gray-400">
                Your gateway to unforgettable sporting experiences worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Packages</div>
                <div className="hover:text-white cursor-pointer">
                  Testimonials
                </div>
                <div className="hover:text-white cursor-pointer">FAQ</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} /> +1 (555) 123-4567
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} /> info@sporttravel.com
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> New York, USA
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <Facebook className="hover:text-blue-400 cursor-pointer" />
                <Instagram className="hover:text-pink-400 cursor-pointer" />
                <Twitter className="hover:text-blue-300 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SportTravel. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-110 z-50"
      >
        <MessageCircle size={24} />
      </a>

      {/* Lead Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-2">Plan Your Trip</h3>
            <p className="text-gray-600 mb-6">
              Fill out the form and we'll get back to you within 24 hours
            </p>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <textarea
                  placeholder="Tell us about your dream trip..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <Check size={24} />
          <div>
            <div className="font-bold">Success!</div>
            <div className="text-sm">We'll contact you within 24 hours</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
