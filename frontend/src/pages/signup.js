import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";

export default function Signup() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await signup(data);
      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/"), 1400);
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSignup}>
        <input
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account? <button type="button" onClick={() => navigate("/")}>Login</button>
      </p>
    </div>
  );
}
