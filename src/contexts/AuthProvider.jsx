import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setaAuthReady] = useState(false);
  const [getbooks, setBooks] = useState([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("failed to fetch user from localStorage", error);
    } finally {
      setaAuthReady(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, getbooks, setBooks, authReady, setaAuthReady }}
    >
      {children}
    </AuthContext.Provider>
  );
};
