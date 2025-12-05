import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future backend integration can go here
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-28">
      {/* 🔹 Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg opacity-90">
          Have questions or suggestions? We’d love to hear from you!
        </p>
      </section>

      {/* 🔹 Contact Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
            Send us a Message ✉️
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition"
            >
              <Send size={18} /> Send Message
            </button>
          </form>

          {submitted && (
            <p className="text-green-600 mt-4 font-semibold">
              ✅ Thank you! We’ll get back to you soon.
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center bg-indigo-50 rounded-2xl shadow-md p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Get in Touch 📞
          </h2>

          <div className="flex items-center gap-4">
            <Mail className="text-indigo-600 w-6 h-6" />
            <p className="text-gray-700 text-lg">libraverse21@gmail.com</p>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="text-indigo-600 w-6 h-6" />
            <p className="text-gray-700 text-lg">
              Hyderabad, Telangana, India 🇮🇳
            </p>
          </div>

          <hr className="border-gray-300 my-4" />

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Follow Us 🌐
          </h3>
          <div className="flex gap-5">
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-indigo-600 transition text-xl"
            >
              🌍 Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              className="hover:text-indigo-600 transition text-xl"
            >
              🕊 Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="hover:text-indigo-600 transition text-xl"
            >
              📸 Instagram
            </a>
          </div>
        </div>
      </section>

      {/* 🔹 CTA Section */}
      <section className="bg-indigo-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-3">
          We’re here to help you learn and grow 📘
        </h2>
        <p className="max-w-3xl mx-auto mb-6 text-lg opacity-90">
          Whether you’re an avid reader or a passionate author, LibraVerse is
          built for you. Drop us a message anytime — we’re just one click away.
        </p>
        <button
          onClick={() => (window.location.href = "/register")}
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          Join LibraVerse
        </button>
      </section>
    </div>
  );
};

export default Contact;
