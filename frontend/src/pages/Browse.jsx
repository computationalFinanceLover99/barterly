import { useState, useEffect } from "react";
 
export default function Browse() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
 
  const token = localStorage.getItem("token");
 
  useEffect(() => {
    fetchUsers();
  }, []);
 
  const fetchUsers = async (query = "") => {
    setMessage("Loading...");
    try {
      const url = query
        ? "http://localhost:8000/users?search=" + encodeURIComponent(query)
        : "http://localhost:8000/users";
      const res = await fetch(url, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setMessage(data.length === 0 ? "No students found." : "");
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch (err) {
      setMessage("Could not connect to server.");
    }
  };
 
  const handleSearch = () => {
    fetchUsers(search);
  };
 
  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
        <p>You are not logged in. <a href="/login">Login here</a></p>
      </div>
    );
  }
 
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: 20 }}>
      <h2>Browse Students</h2>
      <br />
 
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, skill or university..."
        style={{ width: "75%", padding: 8 }}
      />
      <button onClick={handleSearch} style={{ padding: "8px 16px", marginLeft: 8 }}>
        Search
      </button>
      <button onClick={() => { setSearch(""); fetchUsers(); }} style={{ padding: "8px 16px", marginLeft: 8 }}>
        Clear
      </button>
 
      <br />
      <br />
 
      <p>{message}</p>
 
      {users.map((user) => (
        <div key={user.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
          <p><strong>{user.name}</strong> — {user.university}</p>
          <p>Trust Score: {user.trust_score}</p>
          <p>Offers: {user.skills_offered.join(", ") || "None listed"}</p>
          <p>Wants to learn: {user.skills_sought.join(", ") || "None listed"}</p>
        </div>
      ))}
 
      <br />
      <a href="/profile">Back to my profile</a>
    </div>
  );
}