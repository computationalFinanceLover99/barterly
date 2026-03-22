import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("Logging in...");
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("Login successful!");
        window.location.href = "/profile";
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch (err) {
      setMessage("Could not connect to server.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20, border: "1px solid #ccc" }}>
      <h2>Login</h2>
      <br />

      <label>Email</label>
      <br />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />

      <label>Password</label>
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />

      <button onClick={handleLogin} style={{ padding: "8px 20px" }}>
        Login
      </button>

      <br />
      <br />
      <p>{message}</p>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
}
