import { useState, useEffect } from "react";

const CREDIT_COSTS = { 15: 10, 30: 20, 45: 30, 60: 40 };

export default function Booking() {
  const [step, setStep] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [skill, setSkill] = useState("");
  const [duration, setDuration] = useState(45);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/users", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch {
      setMessage("Could not load users.");
    }
  };

  const handleBook = async () => {
    if (!selectedUser || !skill || !date || !time) {
      setMessage("Please fill in all fields.");
      return;
    }
    setMessage("Booking...");
    const scheduledAt = `${date}T${time}:00`;
    try {
      const res = await fetch("http://localhost:8000/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          tutor_id: selectedUser.id,
          skill,
          scheduled_at: scheduledAt,
          duration_min: duration,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmed(data);
        setStep(4);
        setMessage("");
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch {
      setMessage("Could not connect to server.");
    }
  };

  if (step === 4 && confirmed) {
    return (
      <div style={{ maxWidth: 500, margin: "60px auto", padding: 20, border: "1px solid #ccc" }}>
        <h2>✅ Session Booked!</h2>
        <br />
        <p><strong>With:</strong> {confirmed.tutor}</p>
        <p><strong>Skill:</strong> {confirmed.skill}</p>
        <p><strong>Date & Time:</strong> {confirmed.scheduled_at}</p>
        <p><strong>Duration:</strong> {confirmed.duration_min} minutes</p>
        <p><strong>Credits spent:</strong> {confirmed.credits_cost}</p>
        <p><strong>New balance:</strong> {confirmed.your_new_balance} credits</p>
        <br />
        <button onClick={() => { setStep(1); setSelectedUser(null); setSkill(""); setDate(""); setTime(""); setConfirmed(null); }} style={{ padding: "8px 20px", marginRight: 10 }}>
          Book Another
        </button>
        <a href="/sessions"><button style={{ padding: "8px 20px" }}>View My Sessions</button></a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>Book a Session</h2>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Select Student", "Skill & Duration", "Date & Time", "Confirm"].map((s, i) => (
          <div key={s} style={{ padding: "4px 12px", background: step === i + 1 ? "#1a56db" : "#eee", color: step === i + 1 ? "#fff" : "#333", borderRadius: 4, fontSize: 12 }}>
            {i + 1}. {s}
          </div>
        ))}
      </div>

      {/* Step 1 — Select student */}
      {step === 1 && (
        <div>
          <h3>Who do you want to learn from?</h3>
          <br />
          {users.map((u) => (
            <div key={u.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10, cursor: "pointer", background: selectedUser?.id === u.id ? "#e8f0fe" : "#fff" }}
              onClick={() => setSelectedUser(u)}>
              <strong>{u.name}</strong> — {u.university}
              <br />
              <span style={{ fontSize: 13, color: "#555" }}>Offers: {u.skills_offered.join(", ") || "None"}</span>
            </div>
          ))}
          <br />
          <button onClick={() => selectedUser ? setStep(2) : setMessage("Please select a student.")} style={{ padding: "8px 20px" }}>
            Next →
          </button>
          <p style={{ color: "red" }}>{message}</p>
        </div>
      )}

      {/* Step 2 — Skill & Duration */}
      {step === 2 && (
        <div>
          <h3>What do you want to learn?</h3>
          <br />
          <label>Skill</label>
          <br />
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g. Python Basics"
            style={{ width: "100%", padding: 8, marginBottom: 16 }}
          />
          <br />

          <label>Duration</label>
          <br />
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {[15, 30, 45, 60].map((d) => (
              <button key={d} onClick={() => setDuration(d)}
                style={{ padding: "8px 16px", background: duration === d ? "#1a56db" : "#eee", color: duration === d ? "#fff" : "#333", border: "none", cursor: "pointer" }}>
                {d} min<br />
                <small>{CREDIT_COSTS[d]} credits</small>
              </button>
            ))}
          </div>

          <p>Selected: {duration} minutes = <strong>{CREDIT_COSTS[duration]} credits</strong></p>
          <br />
          <button onClick={() => setStep(1)} style={{ padding: "8px 16px", marginRight: 10 }}>← Back</button>
          <button onClick={() => skill ? setStep(3) : setMessage("Enter a skill.")} style={{ padding: "8px 20px" }}>Next →</button>
          <p style={{ color: "red" }}>{message}</p>
        </div>
      )}

      {/* Step 3 — Date & Time */}
      {step === 3 && (
        <div>
          <h3>When do you want to meet?</h3>
          <br />
          <label>Date</label>
          <br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
          <br />
          <label>Time</label>
          <br />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 20 }}
          />

          <div style={{ background: "#f5f5f5", padding: 12, marginBottom: 16 }}>
            <p><strong>Summary</strong></p>
            <p>With: {selectedUser?.name}</p>
            <p>Skill: {skill}</p>
            <p>Duration: {duration} min</p>
            <p>Cost: {CREDIT_COSTS[duration]} credits</p>
            {date && time && <p>When: {date} at {time}</p>}
          </div>

          <button onClick={() => setStep(2)} style={{ padding: "8px 16px", marginRight: 10 }}>← Back</button>
          <button onClick={handleBook} style={{ padding: "8px 20px" }}>Confirm & Book →</button>
          <p style={{ color: "red" }}>{message}</p>
        </div>
      )}
    </div>
  );
}
