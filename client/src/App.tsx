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
import ProtectedRoute from "./components/ProtectedRoute";
import NotAutorisation from "./pages/notAutorisation";

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
  const isMobile = window.innerWidth <= 768; 

  return (
    <div>
      {!isLoginPage && <Sidebar />} 

      {/* ⚠️ les routes des salons doivent commencer obligatoirement par "room" pour la sécurité d'accès au user ayant isApproved = false */}

      <div className={`main-content ${isMobile ? 'mobile' : 'desktop'}`}>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/home" element={<ProtectedRoute requiredRole="admin"><Home /></ProtectedRoute>}/>
          <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>}/>
          <Route path="/room1" element={<ProtectedRoute><Room1 /></ProtectedRoute>}/>
          <Route path="/room2" element={<ProtectedRoute><Room2 /></ProtectedRoute>}/>
          <Route path="/room3" element={<ProtectedRoute><Room3 /></ProtectedRoute>}/>
          <Route path="/access-denied" element={<NotAutorisation />} />
        </Routes>
      </div>
    </div>
  );
}