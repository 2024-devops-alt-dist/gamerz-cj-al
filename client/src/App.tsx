import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import './App.css'
import Login from './pages/login'
import Home from "./pages/home";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/sidebar";
import Profil from "./pages/profil";
import Room1 from "./pages/rooms/room1";
import Room2 from "./pages/rooms/room2";
import Room3 from "./pages/rooms/room3";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </Router>
    </>
  )
}

export default App

function MainContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/"; 

  return (
    <div className="d-flex vh-100">
      {!isLoginPage && <Sidebar />} 

      <div className="flex-grow-1 p-4">
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/home" element={<Home />}/>
          <Route path="/profil" element={<Profil />}/>
          <Route path="/room1" element={<Room1 />}/>
          <Route path="/room2" element={<Room2 />}/>
          <Route path="/room3" element={<Room3 />}/>
        </Routes>
      </div>
    </div>
  );
}