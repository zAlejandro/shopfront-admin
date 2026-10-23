import { useState } from "react";
import { api } from "../services/api.js";
export default function useSession() {
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("u") || "null"),
  );
  const handleLogin = (user) => {
    sessionStorage.setItem("u", JSON.stringify(user));
    setUser(user);
  };
  const handleLogout = () => {
    api.logout?.();
    sessionStorage.removeItem("u");
    setUser(null);
  };
  return {
    user,
    handleLogin,
    handleLogout,
  };
}
