// useAuth.js
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useAuth = () => {
  const history = useHistory();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      // User is not logged in, redirect to login page
      history.push("/login");
    }
  }, [history]);

  return;
};

export default useAuth;
