import { useState, useEffect, useCallback } from "react";
import authService from "../services/auth.services";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(authService.getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
      setToken(authService.getToken());
      setIsAuthenticated(authService.isAuthenticated());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(
    async (credentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login(credentials);
        const currentUser = authService.getCurrentUser();
        const currentToken = authService.getToken();

        setUser(currentUser);
        setToken(currentToken);
        setIsAuthenticated(true);
        setIsLoading(false);

        navigate("/dashboard");
        return { success: true, data: response };
      } catch (err) {
        setIsLoading(false);
        const msg = err.message || "Login failed";
        setError(msg);
        return { success: false, error: msg };
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError: () => setError(null),
  };
};

export default useAuth;
