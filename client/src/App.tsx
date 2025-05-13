import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import './App.css'
import Login from './pages/login'
import Home from "./pages/home";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/sidebar";
import Profil from "./pages/profil";
import ProtectedRoute from "./components/ProtectedRoute";
import NotAutorisation from "./pages/notAutorisation";
import Room from "./pages/rooms/room";
import InfoUserAdmin from "./pages/infoUserAdmin";
import AddUser from "./pages/AddUser";
import AddRoom from "./pages/addRoom";
import DetailsRoom from "./pages/detailsRoom";
import EditRoom from "./pages/editRoom";
import { RoomProvider } from "./context/RoomContext";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <RoomProvider>
            <MainContent />
          </RoomProvider>
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

      <div className={`main-content ${isMobile ? 'mobile' : 'desktop'}`}>
        <Routes>
          <Route path="/" element={<Login />}/>

          <Route path="/home" element={<ProtectedRoute requiredRole="admin"><Home /></ProtectedRoute>}/>
          <Route path="/user/:id" element={<ProtectedRoute requiredRole="admin"><InfoUserAdmin /></ProtectedRoute>} />
          <Route path="/add-user" element={<ProtectedRoute requiredRole="admin"><AddUser /></ProtectedRoute>}/>
          <Route path="/add-room" element={<ProtectedRoute requiredRole="admin"><AddRoom /></ProtectedRoute>}/>
          <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>}/>
          <Route path="/room/:id" element={<ProtectedRoute><Room /></ProtectedRoute>}/>
          <Route path="/room" element={<ProtectedRoute><Room /></ProtectedRoute>}/>
          <Route path="/details-room/:id" element={<ProtectedRoute requiredRole="admin"><DetailsRoom /></ProtectedRoute>} />
          <Route path="/rooms/:id/edit" element={<ProtectedRoute requiredRole="admin"><EditRoom /></ProtectedRoute>} />
          <Route path="/access-denied" element={<ProtectedRoute><NotAutorisation /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}