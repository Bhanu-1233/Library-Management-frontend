import { useEffect, useState } from "react";
import api from "../components/Api";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await api.get("/mypurchases", { withCredentials: true });
        setPurchases(res.data.purchases || []);
      } catch (error) {
        toast.error("Failed to load your purchases");
        console.error("Error fetching purchases", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🛍️ My Purchases</h1>

      {loading ? (
        <Loader />
      ) : purchases.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          You haven’t purchased any books yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <img
                src={
                  p.book.thumbnailphoto || "https://via.placeholder.com/200x250"
                }
                alt={p.book?.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="font-semibold mt-3 text-gray-800 truncate">
                {p.book?.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
