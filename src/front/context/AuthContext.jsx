// src/front/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// 1) Centralize your API root
const API_ROOT =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BACKEND_URL) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  ""; // e.g. "https://<your-backend>-3001.app.github.dev"

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("jwt-token"));
  const [uid, setUid] = useState(localStorage.getItem("user-id"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("auth.user");
    return raw ? JSON.parse(raw) : null;
  });

  const loggedIn = Boolean(token);

  async function loadUser(u = uid, t = token) {
    if (!u) return;
    try {
      const res = await fetch(`${API_ROOT}/api/me/${u}`, {
        headers: {
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
          Accept: "application/json",
        },
      });

      // Helpful logging if something goes wrong
      if (!res.ok) {
        const text = await res.text();
        console.warn("GET /me failed", res.status, text);
        return; // don't force logout on a 404 from a wrong base URL
      }

      const me = await res.json();      // <-- will only run if JSON
      setUser(me);
      localStorage.setItem("auth.user", JSON.stringify(me));
    } catch (err) {
      console.error("loadUser error:", err);
    }
  }

  // call this after a successful login
  async function authLogin(newToken, newUid) {
    localStorage.setItem("jwt-token", newToken);
    localStorage.setItem("user-id", newUid);
    setToken(newToken);
    setUid(newUid);
    await loadUser(newUid, newToken);
  }

  function logout() {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user-id");
    localStorage.removeItem("auth.user");
    setToken(null);
    setUid(null);
    setUser(null);
  }

  useEffect(() => {
    if (!user && uid) loadUser(uid, token);
  }, []); // eslint-disable-line

  return (
    <AuthContext.Provider value={{ token, uid, user, role: user?.role, loggedIn, authLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
