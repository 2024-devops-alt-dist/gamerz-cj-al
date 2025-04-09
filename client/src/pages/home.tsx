// Cette page peut être le dashboard affiché aux admins seulement
import '../assets/styles/global.css';
import '../assets/styles/dashboard.css';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IUser } from '../models/IUser';
import Check from '../assets/pic⁫tures/check.png';
import Close from '../assets/pic⁫tures/close.png';
import { getUsers, updateUserApproval } from '../services/api';

const Home: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<IUser[]>([]); // tous les users
    const [notApprovedUsers, setNotApprovedUsers] = useState<IUser[]>([]); // users isApproved=false
    const [loading, setLoading] = useState(true);
    const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
    
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

    return (
        <>
        <div className="p-4">
            <h1 className="mb-5 dash-title">Dashboard - Bienvenue {user?.username} !</h1>
            <p> Rôle : {user?.role}</p>
            <h2 className="mb-4 dash-subTitle">Voici les demandes du jour :</h2>
        </div>

        {/* Tableau des demandes d'approbation */}
        <div className="table-content">
                {loading ? (
                    <p>Chargement...</p>
                ) : notApprovedUsers.length === 0 ? (
                    <p className="text-center text-success">Aucune demande en attente.</p>
                ) : (
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Pseudo</th>
                                <th scope="col">Email</th>
                                <th scope="col">Description</th>
                                <th scope="col">Approved</th>
                            </tr>
                        </thead>
                        <tbody>
                        {notApprovedUsers.map((user, index) => {
                            const isExpanded = expandedDescriptions[user._id] || false;
                            const descriptionToDisplay = isExpanded
                                ? user.description
                                : truncateDescription(user.description, 150);

                            return (
                                <tr key={`${user.username}-${index}`}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div>
                                            {descriptionToDisplay}
                                            {user.description.length > 150 && (
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
                                        <button className="btn btn-success btn-sm" onClick={() => handleApprovalChange(user._id, true)}>
                                            <img src={Check} alt="Approve" style={{ width: "20px", height: "20px" }} />
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleApprovalChange(user._id, false)}>
                                            <img src={Close} alt="Reject" style={{ width: "20px", height: "20px" }} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
                )}
            </div>

            {/* Tableau de tous les utilisateurs */}
            <div className="table-content">
                <h2 className="mb-4 dash-subTitle">Tous les utilisateurs :</h2>
                <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Pseudo</th>
                            <th scope="col">Email</th>
                            <th scope="col">Description</th>
                            <th scope="col">Approved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            const isExpanded = expandedDescriptions[user._id] || false;
                            const descriptionToDisplay = isExpanded
                                ? user.description
                                : truncateDescription(user.description, 150);

                            return (
                                <tr key={`${user.username}-${index}`}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div>
                                            {descriptionToDisplay}
                                            {user.description.length > 150 && (
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
                                    <td>{user.isApproved ? 'Oui' : 'Non'}</td>
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