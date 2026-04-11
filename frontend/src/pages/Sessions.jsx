import { useState, useEffect } from "react";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setMessage("Loading...");
    try {
      const res = await fetch("http://localhost:8000/sessions", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (res.ok) {
        setSessions(data);
        setMessage(data.length === 0 ? "No sessions yet. Book one first!" : "");
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch {
      setMessage("Could not connect to server.");
    }
  };

  const cancelSession = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/sessions/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Session cancelled. Credits refunded. New balance: " + data.new_balance);
        fetchSessions();
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch {
      setMessage("Could not connect to server.");
    }
  };

  const completeSession = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/sessions/${id}/complete`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Session completed! Credits earned. New balance: " + data.new_balance);
        fetchSessions();
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch {
      setMessage("Could not connect to server.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h2>My Sessions</h2>
      <br />
      <p>{message}</p>

      {sessions.map((s) => (
        <div key={s.id} style={{ border: "1px solid #ccc", padding: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p><strong>{s.skill}</strong></p>
              <p>{s.role === "learner" ? "Learning from" : "Teaching"}: {s.with}</p>
              <p>📅 {s.scheduled_at}</p>
              <p>⏱ {s.duration_min} min · 💎 {s.credits_cost} credits</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{
                padding: "3px 10px", borderRadius: 4, fontSize: 12,
                background: s.status === "completed" ? "#d1fae5" : s.status === "cancelled" ? "#fee2e2" : "#dbeafe",
                color: s.status === "completed" ? "green" : s.status === "cancelled" ? "red" : "blue"
              }}>
                {s.status}
              </span>
              <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                {s.role === "learner" ? "You are learning" : "You are teaching"}
              </p>
            </div>
          </div>

          {s.status === "scheduled" && (
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              {s.role === "learner" && (
                <button onClick={() => cancelSession(s.id)} style={{ padding: "6px 14px" }}>
                  Cancel Session
                </button>
              )}
              {s.role === "tutor" && (
                <button onClick={() => completeSession(s.id)} style={{ padding: "6px 14px" }}>
                  Mark as Complete
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <br />
      <a href="/booking">Book a new session</a>
      {" · "}
      <a href="/credits">View credits</a>
      {" · "}
      <a href="/profile">Profile</a>
    </div>
  );
}
