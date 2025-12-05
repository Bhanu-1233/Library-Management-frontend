import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/useAuth.js";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import Layout from "./pages/Layout";
import DashBoard from "./pages/DashBoard";
import Borrowed from "./pages/Borrowed";
import Returned from "./pages/Returned";
import Home from "./pages/Home";
import Borrow from "./pages/Borrow";
import Return from "./pages/Return";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import AuthorDashBoard from "./pages/Author/AuthorDashboard";
import AddBook from "./pages/Author/AddBook";
import UpdateBook from "./pages/Author/UpdateBook";
import MyPurchases from "./pages/MyPurchases";
import MySales from "./pages/Author/MySales";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AuthorLayout from "./pages/Author/AuthorLayout";
import AuthorBooks from "./pages/Author/AuthorBooks";
import BookDetails from "./pages/BookDetails";
import SearchResults from "./components/SearchResults";

import Loader from "./components/Loader"; // ✅ global loader

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// ===================================================================
// SEPARATE COMPONENT TO HANDLE authReady LOADING
// ===================================================================

function AppContent() {
  const { authReady } = useAuth();

  // 🔥 Global loader before the entire app loads
  if (!authReady) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        toastStyle={{
          borderRadius: "10px",
          color: "#fff",
          fontWeight: "500",
        }}
        progressStyle={{
          background: "linear-gradient(to right, #34d399, #3b82f6)",
        }}
      />
    </>
  );
}

// ===================================================================
// MAIN ROUTING LOGIC
// ===================================================================

function AppRoutes() {
  const { user } = useAuth();

  // AUTHOR ROUTES
  if (user?.role === "author") {
    return (
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <AuthorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/author-dashboard" element={<AuthorDashBoard />} />
          <Route path="/createbook" element={<AddBook />} />
          <Route path="/updatebook/:id" element={<UpdateBook />} />

          <Route
            path="/mybooks"
            element={
              <ProtectedRoute>
                <AuthorBooks />
              </ProtectedRoute>
            }
          />

          <Route path="/mysales" element={<MySales />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* redirect unknown paths */}
        <Route path="*" element={<Navigate to="/author-dashboard" replace />} />
      </Routes>
    );
  }

  // USER ROUTES
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/searchbooks" element={<SearchResults />} />

        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/borrow"
          element={
            <ProtectedRoute>
              <Borrow />
            </ProtectedRoute>
          }
        />

        <Route
          path="/borrowed"
          element={
            <ProtectedRoute>
              <Borrowed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/return"
          element={
            <ProtectedRoute>
              <Return />
            </ProtectedRoute>
          }
        />

        <Route
          path="/returned"
          element={
            <ProtectedRoute>
              <Returned />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mypurchases"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

// ===================================================================
// ROOT APP COMPONENT
// ===================================================================

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
