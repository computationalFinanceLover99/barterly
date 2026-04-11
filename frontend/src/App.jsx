import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";
import Browse from "./pages/Browse";
import Matches from "./pages/Matches";
import Booking from "./pages/Booking";
import Sessions from "./pages/Sessions";
import Credits from "./pages/Credits";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Navigate to="/login" />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile"  element={<Profile />} />
        <Route path="/browse"   element={<Browse />} />
        <Route path="/matches"  element={<Matches />} />
        <Route path="/booking"  element={<Booking />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/credits"  element={<Credits />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
