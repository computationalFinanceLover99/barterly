import { useState, useEffect } from "react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [year, setYear] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsSought, setSkillsSought] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/profile/me", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setBio(data.bio || "");
        setYear(data.year || "");
        setSkillsOffered(data.skills_offered.join(", "));
        setSkillsSought(data.skills_sought.join(", "));
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch (err) {
      setMessage("Could not connect to server.");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setMessage("Saving...");
    try {
      const res = await fetch("http://localhost:8000/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          bio,
          year,
          skills_offered: skillsOffered.split(",").map((s) => s.trim()).filter(Boolean),
          skills_sought: skillsSought.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile saved successfully!");
        fetchProfile();
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch (err) {
      setMessage("Could not connect to server.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: 20, border: "1px solid #ccc" }}>
      <h2>My Profile</h2>
      <br />

      {profile && (
        <div style={{ marginBottom: 20, padding: 10, background: "#f5f5f5" }}>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>University:</strong> {profile.university}</p>
          <p><strong>Credits:</strong> {profile.credits}</p>
          <p><strong>Trust Score:</strong> {profile.trust_score}</p>
        </div>
      )}

      <label>Bio</label>
      <br />
      <input
        type="text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Write a short bio"
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

      <label>Skills I Offer (comma separated)</label>
      <br />
      <input
        type="text"
        value={skillsOffered}
        onChange={(e) => setSkillsOffered(e.target.value)}
        placeholder="e.g. Python, React, Statistics"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />

      <label>Skills I Want to Learn (comma separated)</label>
      <br />
      <input
        type="text"
        value={skillsSought}
        onChange={(e) => setSkillsSought(e.target.value)}
        placeholder="e.g. Machine Learning, UI Design"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <br />

      <button onClick={handleSave} style={{ padding: "8px 20px" }}>
        Save Profile
      </button>

      <br />
      <br />
      <p>{message}</p>
      <p><a href="/browse">Browse other students</a></p>
    </div>
  );
}