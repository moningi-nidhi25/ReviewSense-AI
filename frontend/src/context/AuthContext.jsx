import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  });
  // True while we verify a stored token on first load.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getCurrentUser();
        if (!cancelled) {
          setUser(res.data);
          localStorage.setItem("auth_user", JSON.stringify(res.data));
        }
      } catch {
        if (!cancelled) {
          setToken(null);
          setUser(null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("auth_user");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((accessToken, userData) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await loginUser({ email, password });
      persist(res.data.access_token, res.data.user);
      return res.data;
    },
    [persist]
  );

  const register = useCallback(
    async (email, password, homestayName) => {
      const res = await registerUser({
        email,
        password,
        homestay_name: homestayName ? homestayName.trim() : undefined,
      });
      persist(res.data.access_token, res.data.user);
      return res.data;
    },
    [persist]
  );

  // Used by the OAuth callback page, which already has a token from the backend redirect.
  const loginWithToken = useCallback(
    (accessToken, userData) => {
      persist(accessToken, userData);
    },
    [persist]
  );

  const logout = useCallback(() => {
    logoutUser().catch(() => {});
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    loginWithToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
