import { Link } from "react-router-dom";
import { Dropdown, Nav } from "react-bootstrap";
import '../assets/styles/global.css';
import '../assets/styles/sidebar.css';
import profilIcon from '../assets/pic⁫tures/avatar1.png'
import logoIcon from '../assets/pic⁫tures/loco-icon.png';
import iconMicro from '../assets/pic⁫tures/audio.png';
import iconMicroOff from '../assets/pic⁫tures/micro-off.png';
import iconCamera from '../assets/pic⁫tures/camera.png';
import iconCameraOff from '../assets/pic⁫tures/camera-off.png';
import closeIcon from '../assets/pic⁫tures/close.png'; 
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IRoom } from "../models/IRoom";
import { getRooms } from "../api/services/roomService";

function Sidebar() {
    const [cameraOn, setCameraOn] = useState(true);
    const [microOn, setMicroOn] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const { logout } = useAuth();
    
    const toggleMenu = () => setShowMenu(prev => !prev);

    const toggleCamera = () => setCameraOn(prevState => !prevState);
    const toggleMicro = () => setMicroOn(prevState => !prevState);
    
    const handleNavClick = () => {setShowMenu(false);};

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await getRooms();
                let rooms: IRoom[] = [];
                for(let element of res.data) {
                    const room: IRoom = {
                        id: element._id,
                        name : element.name,
                        description : element.description,
                        picture: element.picture,
                    } 
                    rooms.push(room);
                };
                setRooms(rooms);
                console.log(rooms);
            } catch (error) {
                console.error("Erreur lors du chargement des salons :", error);
            }
        };

        fetchRooms();
    }, []);

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
                {rooms.map((room) => (
                    <Nav.Link as={Link} key={room.id} to={`/room/${room.id}`} title={room.name} className="sidebar-icon">
                        <img src={`../assets/pictures/${room.picture}`} alt={room.name} />
                    </Nav.Link>
                ))}
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
