import { Link } from "react-router-dom";
import { Dropdown, Nav } from "react-bootstrap";
import '../assets/styles/global.css';
import '../assets/styles/sidebar.css';
import profilIcon from '../assets/pic⁫tures/avatar1.png'
import Room1 from '../assets/pic⁫tures/assassinsCreed.jpeg'
import Room2 from '../assets/pic⁫tures/minecraft.jpg'
import Room3 from '../assets/pic⁫tures/witcher3.jpg'
import logoIcon from '../assets/pic⁫tures/loco-icon.png';
import iconMicro from '../assets/pic⁫tures/audio.png';
import iconMicroOff from '../assets/pic⁫tures/micro-off.png';
import iconCamera from '../assets/pic⁫tures/camera.png';
import iconCameraOff from '../assets/pic⁫tures/camera-off.png';
import closeIcon from '../assets/pic⁫tures/close.png'; 
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const [cameraOn, setCameraOn] = useState(true);
    const [microOn, setMicroOn] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const { logout } = useAuth();
    
    const toggleMenu = () => setShowMenu(prev => !prev);

    const toggleCamera = () => setCameraOn(prevState => !prevState);
    const toggleMicro = () => setMicroOn(prevState => !prevState);
    
    const handleNavClick = () => {
        setShowMenu(false);
    };

    return (
        <>
        {/* Icône du menu hamburger en dehors de la sidebar */}
        <div className="menu-icon-container">
            <img
                src={showMenu ? closeIcon : logoIcon}
                alt={showMenu ? "Fermer le menu" : "Ouvrir le menu"}
                className={`logo-icon2 d-block d-md-none ${showMenu ? 'close-icon' : ''}`}
                onClick={toggleMenu}
                role="button"
            />
        </div>
        
        <div className={`sidebar bg-cust text-white p-4 d-flex flex-column vh-100 ${showMenu ? 'show-mobile' : ''}`}>
            <Link to="/home" onClick={handleNavClick}>
                <img src={logoIcon} alt="Logo icon" className="logo-icon2" />
            </Link>

            <Nav className="flex-column align-items-center gap-2 flex-grow-1 icon-container" onClick={handleNavClick}>
                <Nav.Link as={Link} to="/room1" className="sidebar-icon">
                    <img src={Room1} alt="Salon 1" />
                </Nav.Link>
                <Nav.Link as={Link} to="/room2" className="sidebar-icon">
                    <img src={Room3} alt="Salon 2" />
                </Nav.Link>
                <Nav.Link as={Link} to="/room3" className="sidebar-icon">
                    <img src={Room2} alt="Salon 3" />
                </Nav.Link>
            </Nav>
        
            <div className="d-flex justify-content-between my-2 gap-2">
                <img 
                    src={microOn ? iconMicro : iconMicroOff} 
                    alt="icon micro" 
                    className="icon-micro" 
                    onClick={toggleMicro}  
                />
                <img 
                    src={cameraOn ? iconCamera : iconCameraOff} 
                    alt="icon camera" 
                    className="icon-camera" 
                    onClick={toggleCamera}  
                />
            </div>

            {/* Profil */}
            <div className="sidebar-footer d-flex align-items-center justify-content-between">
                <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-profile">
                        <img src={profilIcon} alt="Profil" className="profile-pic" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/profil" onClick={handleNavClick}>Profil</Dropdown.Item>
                        <Dropdown.Item onClick={logout}>Déconnexion</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
        </>
        
    );
}

export default Sidebar;
