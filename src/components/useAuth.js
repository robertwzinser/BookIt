import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      // User is not logged in, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  return null; // No return value needed for this hook
};

export default useAuth;
