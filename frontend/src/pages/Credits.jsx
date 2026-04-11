import { useState, useEffect } from "react";

export default function Credits() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    setMessage("Loading...");
    try {
      const res = await fetch("http://localhost:8000/credits", {
        headers: { Authorization: "Bearer " + token },
      });
      const json = await res.json();
      if (res.ok) {
        setData(json);
        setMessage("");
      } else {
        setMessage("Error: " + json.detail);
      }
    } catch {
      setMessage("Could not connect to server.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>Credit Wallet</h2>
      <br />

      <p>{message}</p>

      {data && (
        <>
          <div style={{ background: "#f0f4ff", border: "1px solid #ccc", padding: 20, marginBottom: 24, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#666" }}>Current Balance</p>
            <p style={{ fontSize: 48, fontWeight: "bold", color: "#1a56db", margin: "8px 0" }}>
              {data.balance}
            </p>
            <p style={{ fontSize: 14, color: "#666" }}>credits</p>
          </div>

          <h3>Transaction History</h3>
          <br />

          {data.transactions.length === 0 && (
            <p style={{ color: "#666" }}>No transactions yet. Book a session to get started.</p>
          )}

          {data.transactions.map((t) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <div>
                <p style={{ margin: 0 }}>{t.note || "Credit transaction"}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{t.created_at}</p>
              </div>
              <div style={{ fontWeight: "bold", color: t.type === "earn" ? "green" : "red", fontSize: 16 }}>
                {t.type === "earn" ? "+" : "-"}{t.amount}
              </div>
            </div>
          ))}
        </>
      )}

      <br />
      <a href="/sessions">View sessions</a>
      {" · "}
      <a href="/booking">Book a session</a>
      {" · "}
      <a href="/profile">Profile</a>
    </div>
  );
}
