import '../assets/styles/global.css';
import '../assets/styles/dashboard.css';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IUser } from '../models/IUser';
import Check from '../assets/pic⁫tures/check.png';
import Close from '../assets/pic⁫tures/close.png';
import Add from '../assets/pic⁫tures/add.png';
import { deleteUser, getUsers, updateUserApproval } from '../api/services/userService';
import { useNavigate } from 'react-router-dom';
import ModalConfirm from '../components/modalDeleteConfirmUser';
import { Button } from 'react-bootstrap';
import { IRoom } from '../models/IRoom';
import { deleteRoom, getRooms } from '../api/services/roomService';
import ModalConfirmRoom from '../components/modalDeleteConfirmRoom';

const Home: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<IUser[]>([]); // tous les users
    const [notApprovedUsers, setNotApprovedUsers] = useState<IUser[]>([]); // users isApproved=false
    const [loading, setLoading] = useState(true);
    const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [settingsOpen, setSettingsOpen] = useState<{ [key: string]: boolean }>({});
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
    
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [roomToDelete, setRoomToDelete] = useState<IRoom | null>(null);

    const navigate = useNavigate();

    // Récupération des utilisateurs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
                setNotApprovedUsers(response.data.filter((u: IUser) => !u.isApproved && !u.isBanned)); // Filtrage des non approuvés

                const roomsRes = await getRooms();
                setRooms(roomsRes.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Gérer le redimensionnement de la fenêtre
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    // Approuver ou refuser une demande
    const handleApprovalChange = async (userId: string, approved: boolean) => {
        if (!userId) {
            console.error('ID utilisateur manquant');
            return;
        }
    
        try {
            await updateUserApproval(userId, approved);
            // Mise à jour de l'état des utilisateurs
            setNotApprovedUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            // Mettre à jour également tableau liste des users
            setUsers(prevUsers => 
                prevUsers.map(user =>
                    user._id === userId ? { ...user, isApproved: approved } : user
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'approbation :", error);
        }
    };

    // Fonction pour gérer l'affichage de la description
    const truncateDescription = (description: string, maxLength: number) => {
        if (description.length <= maxLength) return description;
        return description.slice(0, maxLength) + '...';
    };

    const getMaxLength = () => {
        if (screenWidth <= 400) {
            return 60; 
        } else if (screenWidth <= 560) {
            return 120; 
        }
        return 150;
    };

    const maxLength = getMaxLength();

    // Fonction pour ouvrir/fermer le menu déroulant
    const toggleSettingsMenu = (userId: string) => {
        setSettingsOpen((prevState) => {
            const newSettingsOpen: { [key: string]: boolean } = {};
            newSettingsOpen[userId] = !prevState[userId];
    
            return newSettingsOpen;
        });
    };

    // Fonction pour gérer les actions du menu "listes des users"
    const handleMenuActionUser = (action: string, userId: string) => {
        switch (action) {
            case 'detail':
                navigate(`/user/${userId}`);
                break;
            case 'delete':
                const selectedUser = users.find(u => u._id === userId);
                if (selectedUser) {
                    setUserToDelete(selectedUser);
                }
                break;
            default:
                break;
        }
    };

    const handleMenuActionRoom = (action: string, roomId: string) => {
        switch (action) {
            case 'detail':
                navigate(`/details-room/${roomId}`);
                break;
            case 'delete':
                const selectedRoom = rooms.find(r => r._id === roomId);
                if (selectedRoom) {
                    setRoomToDelete(selectedRoom); 
                }
                break;
            default:
                break;
        }
    };
    

    const confirmDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            setUserToDelete(null);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
    };

    const confirmDeleteRoom = async (roomId: string) => {
        try {
            await deleteRoom(roomId);
            setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
            setRoomToDelete(null);
        } catch (error) {
            console.error("Erreur lors de la suppression du salon :", error);
        }
    };

    return (
        <>
        <div className="p-4 space-mob">
            <h1 className="mb-5 dash-title">Dashboard - Bienvenue {user?.username} !</h1>
            <h2 className="dash-subTitle">Les demandes du jour :</h2>
        </div>

        {/* Tableau des demandes d'approbation */}
        <div className="table-content custom-marge">
                {loading ? (
                    <p>Chargement...</p>
                ) : notApprovedUsers.length === 0 ? (
                    <p className="text-center text-info">Vous êtes à jour ! Aucune demande en attente.</p>
                ) : (
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Pseudo</th>
                                <th>Email</th>
                                <th style={{ width: '800px' }}>Message</th>
                                <th>Valider ?</th>
                            </tr>
                        </thead>
                        <tbody>
                        {notApprovedUsers.map((user, index) => {
                            const isExpanded = expandedDescriptions[user._id] || false;
                            const descriptionToDisplay = isExpanded
                                ? user.description
                                : truncateDescription(user.description, maxLength);

                            return (
                                <tr key={`${user.username}-${index}`}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div>
                                            {descriptionToDisplay}
                                            {user.description.length > maxLength && (
                                                <button
                                                    onClick={() =>
                                                        setExpandedDescriptions(prev => ({
                                                            ...prev,
                                                            [user._id]: !prev[user._id],
                                                        }))
                                                    }
                                                    className="btn btn-link btn-sm text-decoration-none"
                                                >
                                                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <button className="btn btn-success btn-sm" onClick={() => handleApprovalChange(user._id, true)}>
                                                <img src={Check} alt="Approve" style={{ width: "20px", height: "20px" }} />
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleApprovalChange(user._id, false)}>
                                                <img src={Close} alt="Reject" style={{ width: "20px", height: "20px" }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
                )}
            </div>

            {/* Tableau de tous les utilisateurs */}
            <div className="table-content custom-marge">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="dash-subTitle">Liste de vos utilisateurs :</h2>
                    <Button className="btn btn-secondary btn-menu position-relative" onClick={() => navigate('/add-user')}>
                        <img src={Add} alt="icon edit" style={{ width: '19px', height: '19px' }}/>
                        <span className="btn-text">Ajouter</span>
                    </Button>
                </div>
                <table className="table table-dark table-striped table-hover users-table">
                    <thead>
                        <tr>
                            <th scope="col">Pseudo</th>
                            <th scope="col">Email</th>
                            <th scope="col">Approuvé(e) ?</th>
                            <th scope="col">Banni ?</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            return (
                                <tr key={`${user.username}-${index}`}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <img
                                            src={user.isApproved ? Check : Close}
                                            alt={user.isApproved ? "Approuvé" : "Non approuvé"}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                    </td>
                                    <td>
                                        <img
                                            src={user.isBanned ? Check : Close}
                                            alt={user.isBanned ? "Banni" : "Non banni"}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm btn-menu" onClick={() => toggleSettingsMenu(user._id)}>
                                                ⋮
                                        </button>
                                        {settingsOpen[user._id] && (
                                            <div className="dropdown-menu show">
                                                <button className="dropdown-item" onClick={() => handleMenuActionUser('detail', user._id)}>
                                                    Profil User
                                                </button>
                                                <button className="dropdown-item" onClick={() => handleMenuActionUser('delete', user._id)}>
                                                    Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Tableau de tous les salons */}
            <div className="table-content custom-marge">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="dash-subTitle">Liste des salons :</h2>
                    <Button className="btn btn-secondary btn-menu position-relative" onClick={() => navigate('/add-room')}>
                        <img src={Add} alt="icon edit" style={{ width: '19px', height: '19px' }}/>
                        <span className="btn-text">Ajouter</span>
                    </Button>
                </div>
                {rooms.length === 0 ? (
                    <p className="text-center text-info">Aucun salon disponible pour le moment.</p>
                ) : (
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th className="wide-column">Nom du salon</th>
                                <th>Description</th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room._id}>
                                    <td className="wide-column">{room.name}</td>
                                    <td>{room.description}</td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm btn-menu" onClick={() => toggleSettingsMenu(room._id)}>
                                                ⋮
                                        </button>
                                        {settingsOpen[room._id] && (
                                            <div className="dropdown-menu show">
                                                <button className="dropdown-item" onClick={() => handleMenuActionRoom('detail', room._id)}>
                                                    Details salon
                                                </button>
                                                <button className="dropdown-item"  onClick={() => handleMenuActionRoom('delete', room._id)}>
                                                    Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            <ModalConfirm 
                userToDelete={userToDelete} 
                setUserToDelete={setUserToDelete} 
                confirmDeleteUser={confirmDeleteUser} 
            />

            <ModalConfirmRoom 
                roomToDelete ={roomToDelete } 
                setRoomToDelete={setRoomToDelete} 
                confirmDeleteRoom={confirmDeleteRoom} 
            />
        </>
    );
};

export default Home;
