import { useState, useEffect } from "react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("");
  const [requested, setRequested] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setMessage("Loading matches...");
    try {
      const res = await fetch("http://localhost:8000/matches", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (res.ok) {
        setMatches(data);
        setMessage(data.length === 0 ? "No matches found. Add more skills to your profile to get matches." : "");
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch {
      setMessage("Could not connect to server.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h2>AI Smart Matching</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Students ranked by how well your skills match theirs.
      </p>

      <p>{message}</p>

      {matches.map((m) => (
        <div key={m.id} style={{ border: "1px solid #ccc", padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: 0 }}>{m.name}</h3>
              <p style={{ color: "#666", margin: "4px 0" }}>{m.university}</p>
              <p style={{ margin: "4px 0" }}>⭐ Trust Score: {m.trust_score}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#1a56db" }}>
                {m.compatibility_score}% match
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <p><strong>Offers:</strong> {m.skills_offered.join(", ") || "None listed"}</p>
            <p><strong>Wants:</strong> {m.skills_sought.join(", ") || "None listed"}</p>
            {m.they_can_teach.length > 0 && (
              <p style={{ color: "green" }}>
                ✓ They can teach you: {m.they_can_teach.join(", ")}
              </p>
            )}
            {m.i_can_teach.length > 0 && (
              <p style={{ color: "blue" }}>
                ✓ You can teach them: {m.i_can_teach.join(", ")}
              </p>
            )}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <a href={`/user/${m.id}`}>
              <button style={{ padding: "6px 14px" }}>View Profile</button>
            </a>
            <button
              onClick={() => {
                setRequested((prev) => [...prev, m.id]);
              }}
              disabled={requested.includes(m.id)}
              style={{ padding: "6px 14px" }}
            >
              {requested.includes(m.id) ? "✓ Requested" : "Request Session"}
            </button>
          </div>
        </div>
      ))}

      <br />
      <a href="/profile">← Back to profile</a>
    </div>
  );
}
