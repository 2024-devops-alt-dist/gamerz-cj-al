import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUser, getUserById, updateUserApproval, updateUserBan } from '../api/services/userService';
import { IUser } from '../models/IUser';
import '../assets/styles/global.css';
import '../assets/styles/infoUserAdmin.css';
import { Button } from 'react-bootstrap';
// import Edit from '../assets/pic⁫tures/edit.png';
import Delete from '../assets/pic⁫tures/delete.png';
import ModalConfirm from '../components/modalDeleteConfirmUser';
import Check from '../assets/pic⁫tures/check.png';
import Close from '../assets/pic⁫tures/close.png';

const InfoUserAdmin: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<IUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
    const [approvalMessage, setApprovalMessage] = useState<string | null>(null);
    const [banMessage, setBanMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
        if (!id) return;
        try {
            const response = await getUserById(id);
            setUser(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
        };

        fetchUser();
    }, [id]);

    const handleApprovalChange = async (approved: boolean) => {
        if (!user?._id) return;
    
        try {
            await updateUserApproval(user._id, approved);
            setUser(prev => prev ? { ...prev, isApproved: approved } : null);
            setApprovalMessage(`Accès ${approved ? 'autorisé' : 'refusé'} activé.`);
    
            // Cacher le message après 3 secondes
            setTimeout(() => setApprovalMessage(null), 3000);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const handleBanChange = async (banned: boolean) => {
        if (!user?._id) return;
    
        try {
            await updateUserBan(user._id, banned);

            // Si banni, on fait aussi l'appel pour désapprouver l'accès
            if (banned && user.isApproved) {
                await updateUserApproval(user._id, false);
            }

            setUser(prev => prev ? { ...prev, isBanned: banned, isApproved: banned ? false : prev.isApproved } : null);

            setBanMessage(`Utilisateur ${banned ? 'banni' : 'réintégré'} avec succès.`);
            setTimeout(() => setBanMessage(null), 3000);
        } catch (error) {
            console.error("Erreur lors du bannissement :", error);
        }
    };

    if (!user) return <p>Chargement des infos utilisateur...</p>;

    const confirmDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId); 
            navigate('/home'); 
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    return (
        <>
            <div className="p-4 dash-title">
                <div className="d-flex justify-content-between mb-5">
                    <h1>Détail du profil utilisateur</h1>
                    <div className="d-flex gap-3">
                        {/* <Button className="btn btn-secondary btn-menu position-relative">
                            <img
                                src={Edit}
                                alt="icon edit"
                                style={{ width: '19px', height: '19px' }}
                            />
                            <span className="btn-text">Modifier</span>
                        </Button> */}

                        <Button
                            className="d-flex justify-content-center align-items-center bg-danger border-0"
                            style={{ width: '38px', height: '38px' }}
                            onClick={() => setUserToDelete(user)}
                        >
                            <img src={Delete} alt="icon delete" style={{ width: '19px', height: '19px' }} />
                        </Button>
                    </div>
                </div>

                <div className="space-y-3 mt-4">
                    <div>
                        <p>Pseudo : {user.username}</p>
                        <p>Email : {user.email}</p>
                    </div>
                    <p className="description-title">Description : </p>
                    <p>{user.description || "Aucune description"}</p>
                    <div>
                        <div className="content-statut">
                            <p className="statut-title">Accès autorisé ? :</p>
                            <div className="d-flex gap-3 align-items-center">
                                <Button className={`btn ${user.isApproved ? 'btn-success' : 'btn-disable'}`} onClick={() => handleApprovalChange(true)}>
                                    <img src={Check} alt="check" style={{ width: '20px', height: '20px' }} />
                                </Button>
                                <Button className={`btn ${!user.isApproved ? 'btn-danger' : 'btn-disable'}`} onClick={() => handleApprovalChange(false)}>
                                    <img src={Close} alt="close" style={{ width: '20px', height: '20px' }} />
                                </Button>
                            </div>
                            
                        </div>
                        {approvalMessage  && (
                            <div className="successMessageApproved" role="alert">
                                {approvalMessage }
                            </div>
                        )}

                        <div className="content-ban">
                            <p className="ban-title">Banni ? :</p>
                            <div className="d-flex gap-3 align-items-center">
                                <Button className={`btn ${user.isBanned ? 'btn-success' : 'btn-disable'}`} onClick={() => handleBanChange(true)}>
                                    <img src={Check} alt="check" style={{ width: '20px', height: '20px' }} />
                                </Button>
                                <Button className={`btn ${!user.isBanned ? 'btn-danger' : 'btn-disable'}`} onClick={() => handleBanChange(false)}>
                                    <img src={Close} alt="close" style={{ width: '20px', height: '20px' }} />
                                </Button>
                            </div>
                        </div>
                        {banMessage && (
                            <div className="successMessageApproved" role="alert">
                                {banMessage}
                            </div>
                        )}
                    </div>
                </div>

                {/* <div className="d-flex gap-3">
                    <Button className="d-flex justify-content-center align-items-center btn-delete bg-danger hover:bg-danger-600" onClick={() => setUserToDelete(user)}>
                        <img className="me-2" src={Delete} alt="icon delete" style={{ width: '19px', height: '19px' }}/>
                        Supprimer
                    </Button>
                </div> */}
            </div>

            <ModalConfirm 
                userToDelete={userToDelete} 
                setUserToDelete={setUserToDelete} 
                confirmDeleteUser={confirmDeleteUser} 
            />
        </>
    );
};

export default InfoUserAdmin;
