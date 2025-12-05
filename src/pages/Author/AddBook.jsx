import React, { useState } from "react";
import api from "../../components/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth.js";

const AddBook = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    author: user?.fullname,
    genre: "",
    availableCopies: "",
    description: "",
    price: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle text input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle image upload
  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    form.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      const res = await api.post("/createbook", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Book added successfully 📚");

      // reset form
      setFormData({
        name: "",
        author: "",
        genre: "",
        availableCopies: "",
        description: "",
        price: "",
      });
      setThumbnail(null);

      // ✅ navigate back to dashboard
      setTimeout(() => navigate("/author-dashboard"), 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add book. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex justify-center items-center min-h-screen  px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          ➕ Add New Book
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Book Name */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Book Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Author Name
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Write a short description about the book..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
              required
            ></textarea>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Available Copies */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Available Copies
            </label>
            <input
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Preview */}
          {thumbnail && (
            <div className="flex justify-center mt-4">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Preview"
                className="w-32 h-40 object-cover rounded border"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg mt-4 hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
