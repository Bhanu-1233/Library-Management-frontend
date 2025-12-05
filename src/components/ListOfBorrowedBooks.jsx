import { React } from "react";
import { useNavigate } from "react-router-dom";

const ListOfBorrowedBooks = ({ item }) => {
  const navigate = useNavigate();
  console.log("Borrowed Item:", item);

  return (
    <div className="shadow-[0_0_10px_white]  hover:shadow-[0_0_20px_white] transition-opacity duration-300 bg-gray-200 rounded-lg border border-gray-300">
      <li className="flex flex-col md:flex-row gap-3 mt-4 p-4 ">
        {/* Image + Price */}
        <div className="flex flex-col gap-6 w-full md:w-auto">
          <img
            className="h-40 sm:w-32 bg-white object-cover w-full"
            src={item.book_id.thumbnailphoto}
            alt="img Not Available"
          />
          <p className="text-gray-400  font-semibold text-md">
            Price
            <br />
            <span className="text-black">₹{item.book_id.price}</span>
          </p>
        </div>

        {/* Book Details */}
        <div className="flex-1 flex flex-col gap-2 ml-0 md:ml-4">
          <h1 className="text-gray-400 font-semibold text-lg">
            Book
            <br />
            <span className="text-md text-black">
              <b>{item.book_id.name}</b>
            </span>
          </h1>

          <h1 className="text-gray-400 font-semibold text-lg">
            Author
            <br />
            <span className="text-md text-black">
              <b>{item.book_id.author.fullname}</b>
            </span>
          </h1>

          <h1 className="text-gray-400  font-semibold text-md">
            Genre: <span>{item.book_id.genre}</span>
          </h1>

          {/* Dates + Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5 gap-2">
            <div className="text-gray-400 font-semibold text-md">
              Issued At
              <br />
              <span className="text-black">
                {new Date(item.issuedAt).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="text-gray-400 font-semibold text-md">
              Return At
              <br />
              <span className="text-red-400 flex items-center">
                {new Date(item.returnAt).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
                {!item.returned ? (
                  <span className="text-black  text-sm font-medium bg-amber-100 px-2 py-1 rounded ml-2 border-none">
                    Not Returned
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold text-sm ml-2">
                    Returned
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </li>

      {/* Return Button */}
      <div className="flex justify-center items-center m-3">
        <button
          onClick={() => navigate("/return", { state: { item } })}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 h-10 w-full sm:w-3/4 cursor-pointer"
        >
          Return Book
        </button>
      </div>
    </div>
  );
};

export default ListOfBorrowedBooks;
