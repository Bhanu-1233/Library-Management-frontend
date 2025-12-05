import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/useAuth.js";
import api from "../components/Api.jsx";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // 🔹 AI-related state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiError, setAiError] = useState("");

  const razorKey = import.meta.env.VITE_RAZORPAY_KEY;

  // 🔹 Fetch Book details (using shared api instance)
  const fetchBook = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await api.get(`/book/${id}`);
      setBook(res.data.book);
    } catch (error) {
      console.error(
        "❌ Error loading book details:",
        error?.response?.data || error
      );

      const msgFromBackend =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to load book details";

      setLoadError(msgFromBackend);
      toast.error("Failed to load book details");

      // If unauthorized, send user to login
      if (error?.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 🔹 Borrow Book
  const handleBorrow = () => {
    if (!user) return navigate("/login");
    navigate("/borrow", { state: { book } });
  };

  // 🔹 Buy Book (Directly open Razorpay)
  const handleBuy = async () => {
    if (!user) return navigate("/login");

    try {
      const res = await api.post("/create-order", {
        user_id: user._id,
        book_id: book._id,
      });

      if (res.data.success) {
        initPay(res.data.order, book);
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while starting payment");
    }
  };

  // 🔹 Ask AI about this book
  const handleAskAi = async () => {
    if (!book) return;

    setAiLoading(true);
    setAiError("");
    setAiText("");
    try {
      const res = await api.get(`/book/${id}/ai-insights`);
      setAiText(res.data.insights || "");
    } catch (error) {
      console.error("AI insights error:", error?.response?.data || error);

      const msgFromBackend =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        null;

      if (msgFromBackend) {
        setAiError(msgFromBackend);
      } else {
        setAiError("Failed to call AI service (network or server error).");
      }

      toast.error("Failed to get AI insights");
    } finally {
      setAiLoading(false);
    }
  };

  // 🔹 Initialize Razorpay Checkout
  const initPay = (order, book) => {
    const options = {
      key: razorKey,
      amount: order.amount,
      currency: order.currency,
      name: "Libraverse 📚",
      description: `Purchase: ${book.name}`,
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifyRes = await api.post("/verify-payment", {
            ...response,
            book_id: book._id,
            user_id: user._id,
          });

          if (verifyRes.data.success) {
            toast.success(`✅ Payment successful for "${book.name}"!`);
            fetchBook();
          } else {
            toast.error("Payment verification failed ❌");
          }
        } catch (err) {
          toast.error("Error verifying payment");
          console.error(err);
        }
      },
      theme: {
        color: "#2563EB",
      },
      modal: {
        ondismiss: () => {
          toast.info("Payment cancelled.");
        },
      },
      prefill: {
        name: user.fullname || "",
        email: user.email || "",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // 🔹 UI
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading book details...
      </div>
    );

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 mt-24">
        <p className="text-red-500 text-lg font-semibold mb-2">
          Book not found!
        </p>
        {loadError && (
          <p className="text-gray-600 text-sm max-w-md">{loadError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 mt-24">
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 max-w-4xl w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 🔹 Book Image */}
          <img
            src={book.thumbnailphoto || "https://via.placeholder.com/300x400"}
            alt={book.name}
            className="w-full max-w-xs md:w-64 md:h-80 h-auto object-cover rounded-lg shadow-md mx-auto"
          />

          {/* 🔹 Book Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {book.name}
            </h1>

            <p className="text-gray-600 mb-2 text-sm md:text-base">
              <strong>Author:</strong> {book.author?.fullname}
            </p>

            <p className="text-gray-600 mb-2 text-sm md:text-base">
              <strong>Genre:</strong> {book.genre}
            </p>

            <p className="text-gray-600 mb-2 text-sm md:text-base">
              <strong>Description:</strong> {book.description}
            </p>

            <p className="text-gray-600 mb-2 text-sm md:text-base">
              <strong>Availability:</strong>{" "}
              <span
                className={`font-semibold ${
                  book.availableCopies > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {book.availableCopies > 0
                  ? `${book.availableCopies} copies available`
                  : "Out of Stock"}
              </span>
            </p>

            <p className="text-gray-600 mb-2 text-sm md:text-base">
              <strong>Created At:</strong>{" "}
              {new Date(book.createdAt).toLocaleDateString("en-GB", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </p>

            <p className="text-gray-600 mb-2 text-sm md:text-base">
              <strong>Last Updated:</strong>{" "}
              {new Date(book.updatedAt).toLocaleDateString("en-GB", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </p>

            <p className="text-xl md:text-2xl font-semibold text-indigo-600 mb-5">
              ₹{book.price}
            </p>

            {/* 🔹 Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBuy}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md w-full sm:w-auto cursor-pointer"
              >
                Buy Now
              </button>

              <button
                onClick={handleBorrow}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg shadow-md w-full sm:w-auto cursor-pointer"
              >
                Borrow Now
              </button>
            </div>

            {/* 🔹 AI Book Assistant */}
            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                AI Book Assistant
              </h2>

              <p className="text-gray-600 text-sm md:text-base mb-3">
                Get an AI-generated summary, who this book is best suited for,
                and similar reading suggestions.
              </p>

              <button
                onClick={handleAskAi}
                disabled={aiLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm md:text-base shadow-md cursor-pointer"
              >
                {aiLoading ? "Asking AI..." : "Ask AI about this book"}
              </button>

              {aiError && (
                <p className="text-red-500 text-xs md:text-sm mt-2">
                  {aiError}
                </p>
              )}

              {aiText && (
                <div className="mt-4 bg-gray-50 border rounded-lg p-3 md:p-4 text-sm md:text-base text-gray-800 whitespace-pre-line">
                  {aiText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
