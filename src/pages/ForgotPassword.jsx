import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../components/Api.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.warning("Please enter your email!");

    try {
      setLoading(true);

      const res = await api.post("/forgot-password", { email });

      toast.success(res.data.message);

      const token = res.data.token;

      // Redirect user to reset page with token
      navigate(`/reset-password?token=${token}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error generating reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          🔐 Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white 
             font-semibold py-2 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
