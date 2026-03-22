import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";
import Browse from "./pages/Browse";
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Navigate to="/login" />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile"  element={<Profile />} />
        <Route path="/browse"   element={<Browse />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;