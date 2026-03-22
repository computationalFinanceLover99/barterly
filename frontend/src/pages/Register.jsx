import { useState } from "react";
 
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
 
  const handleRegister = async () => {
    setMessage("Registering...");
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, university, year, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("Account created successfully!");
        window.location.href = "/profile";
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch (err) {
      setMessage("Could not connect to server.");
    }
  };
 
  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 20, border: "1px solid #ccc" }}>
      <h2>Register</h2>
      <br />
 
      <label>Full Name</label>
      <br />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />
 
      <label>Email</label>
      <br />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your university email"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />
 
      <label>University</label>
      <br />
      <input
        type="text"
        value={university}
        onChange={(e) => setUniversity(e.target.value)}
        placeholder="e.g. FAST-NUCES"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />
 
      <label>Year</label>
      <br />
      <input
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="e.g. Year 3"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />
 
      <label>Password</label>
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />
 
      <button onClick={handleRegister} style={{ padding: "8px 20px" }}>
        Register
      </button>
 
      <br />
      <br />
      <p>{message}</p>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}
