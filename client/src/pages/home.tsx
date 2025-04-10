import '../assets/styles/global.css';
import '../assets/styles/dashboard.css';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IUser } from '../models/IUser';
import Check from '../assets/pic⁫tures/check.png';
import Close from '../assets/pic⁫tures/close.png';
import { getUsers, updateUserApproval } from '../api/services/userService';

const Home: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<IUser[]>([]); // tous les users
    const [notApprovedUsers, setNotApprovedUsers] = useState<IUser[]>([]); // users isApproved=false
    const [loading, setLoading] = useState(true);
    const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [settingsOpen, setSettingsOpen] = useState<{ [key: string]: boolean }>({});

    // Récupération des utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
                setNotApprovedUsers(response.data.filter((u: IUser) => !u.isApproved)); // Filtrage des non approuvés
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

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
    const handleMenuAction = (action: string, userId: string) => {
        switch (action) {
            case 'detail':
                alert(`Afficher le détail du profil de ${userId}`);
                break;
            case 'delete':
                alert(`Supprimer l'utilisateur ${userId}`);
                break;
            case 'modify':
                alert(`Modifier l'utilisateur ${userId}`);
                break;
            default:
                break;
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
                <h2 className="mb-4 dash-subTitle">Liste de vos utilisateurs :</h2>
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
                                                <button className="dropdown-item" onClick={() => handleMenuAction('detail', user._id)}>
                                                    Profil User
                                                </button>
                                                <button className="dropdown-item" onClick={() => handleMenuAction('delete', user._id)}>
                                                    Supprimer
                                                </button>
                                                <button className="dropdown-item" onClick={() => handleMenuAction('modify', user._id)}>
                                                    Modifier
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
        </>
    );
};

export default Home;
