import React, { useEffect, useState } from "react";
import api from "../../components/Api";
import { toast } from "react-toastify";

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalEarnings: 0 });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("/mysales");
        setSales(res.data.sales);
        setStats({
          totalSales: res.data.totalSales,
          totalEarnings: res.data.totalEarnings,
        });
      } catch (error) {
        toast.error("Failed to load sales data");
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">💰 My Sales</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-green-600 text-white p-6 rounded-xl shadow">
          <p className="text-sm opacity-80">Total Sales</p>
          <h2 className="text-3xl font-bold">{stats.totalSales}</h2>
        </div>
        <div className="bg-purple-600 text-white p-6 rounded-xl shadow">
          <p className="text-sm opacity-80">Total Earnings</p>
          <h2 className="text-3xl font-bold">₹{stats.totalEarnings}</h2>
        </div>
      </div>

      {/* Sales Table */}
      {sales.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          You haven’t sold any books yet.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-left text-gray-700">
            <thead className="bg-gray-200 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-3">Book</th>
                <th className="px-6 py-3">Buyer</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{s.book.name}</td>
                  <td className="px-6 py-3">{s.user.fullname}</td>
                  <td className="px-6 py-3 text-indigo-600 font-semibold">
                    ₹{s.amount}
                  </td>
                  <td className="px-6 py-3">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySales;
