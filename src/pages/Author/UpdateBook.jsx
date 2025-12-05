// src/pages/Author/UpdateBook.jsx
import React, { useEffect, useState } from "react";
import api from "../../components/Api";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get("/books");
        const found = res.data.books.find((b) => b._id === id);
        if (found) {
          setBook({
            name: found.name || "",
            genre: found.genre || "",
            description: found.description || "",
            price: found.price || "",
            availableCopies: found.availableCopies || 0,
            thumbnailphoto: found.thumbnailphoto || "",
            author: found.author?._id || found.author || "",
            _id: found._id,
          });
        } else {
          toast.error("Book not found");
          navigate("/mybooks");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch book details");
        navigate("/mybooks");
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!book?.name || !book?.genre) {
      toast.error("Please fill name and genre");
      return;
    }

    const formData = new FormData();
    formData.append("name", book.name);
    formData.append("genre", book.genre);
    formData.append("description", book.description || "");
    formData.append("price", book.price || "");
    formData.append("availableCopies", book.availableCopies || 0);
    // don't append thumbnailphoto URL — let backend keep existing if no file
    if (thumbnail) {
      formData.append("file", thumbnail); // this matches upload.single("file") on backend
    }

    try {
      setLoading(true);
      const res = await api.put(`/updatebook/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message || "Book updated successfully ✅");
      navigate("/mybooks");
    } catch (err) {
      console.error("update error", err);
      toast.error(err.response?.data || "Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  if (!book) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 pt-20">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          ✏️ Update Book
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Book Name</label>
            <input
              type="text"
              name="name"
              value={book.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <input
              type="text"
              name="genre"
              value={book.genre}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={book.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={book.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Available Copies
            </label>
            <input
              type="number"
              name="availableCopies"
              value={book.availableCopies}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {/* show current thumbnail */}
          {book.thumbnailphoto ? (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Current thumbnail</p>
              <img
                src={book.thumbnailphoto}
                alt={book.name}
                className="w-32 h-40 object-cover rounded"
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
