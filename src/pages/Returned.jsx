import { useEffect, useState } from "react";
import api from "../components/Api";
import Loader from "../components/Loader";
import { BookOpenCheck } from "lucide-react";

const Returned = () => {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        const response = await api.get("/user/returned/books", {
          withCredentials: true,
        });
        setReturnedBooks(response.data.returnedBooks || []);
      } catch (error) {
        console.error("Error fetching returned books", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReturnedBooks();
  }, []);

  return (
    <div className="min-h-screen pt-24 px-8 md:mt-10">
      <h1 className="text-3xl text-blue-400 mb-8 text-center">
        Your Returned Books
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : returnedBooks.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t returned any books yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {returnedBooks.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-lg p-4">
              <img
                src={
                  item.book_id?.thumbnailphoto ||
                  "https://via.placeholder.com/400x250"
                }
                alt={item.book_id?.name}
                className="w-full h-60 object-cover rounded-md"
              />
              <h2 className="text-lg font-bold text-blue-500 mt-3 flex items-center gap-3">
                <BookOpenCheck className="text-green-600" />
                {item.book_id?.name}
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Returned;
