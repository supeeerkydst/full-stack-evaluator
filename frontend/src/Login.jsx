import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/axios";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password }); // fixed path
      const user = res.data; // your backend returns { Id, Email }

      localStorage.setItem("user", JSON.stringify(user));
      if (onLoginSuccess && typeof onLoginSuccess === "function") {
        onLoginSuccess(user);
        }
      navigate("/tasks"); // redirect to tasks page
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) setError("Invalid email or password");
      else setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
      <form onSubmit={handleSubmit} style={{ width: "350px", padding: "30px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "15px" }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} />

        {error && <div style={{ color: "#d32f2f", fontSize: "14px", textAlign: "center" }}>{error}</div>}

        <button type="submit" style={{ padding: "12px", borderRadius: "8px", background: "#1976d2", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" }}>Login</button>
      </form>
    </div>
  );
}

export default Login;
