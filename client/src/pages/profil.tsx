import React, { useState } from 'react';
import '../assets/styles/global.css';
import '../assets/styles/profil.css';
import profilIcon from '../assets/pic⁫tures/avatar1.png'
import { useAuth } from '../context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { deleteUser, updateUserInfo } from '../api/services/userService';
import ModalConfirm from '../components/modalDeleteConfirmUser';
import { IUser } from '../models/IUser';

const profileSchema = z.object({
    username: z.string().min(3, 'Nom trop court'),
    email: z.string().email('Email invalide'),
    confirmEmail: z.string().email('Email invalide'),
    description: z.string().min(5, 'Description trop courte').max(500, 'Description trop longue'),
}).refine((data) => data.email === data.confirmEmail, {
    message: "Les e-mails ne correspondent pas",
    path: ["confirmEmail"],
});

const passwordSchema = z.object({
    password: z.string().min(4, "Mot de passe trop court"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

const Profil: React.FC = () => {
    const { user, logout, checkAuth } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [editPasswordMode, setEditPasswordMode] = useState(false);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

    const {register,handleSubmit,formState: { errors }, reset} = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user?.username || '',
            email: user?.email || '',
            confirmEmail: user?.email || '',
            description: user?.description || '',
        },
    });
    
    const {register: registerPwd, handleSubmit: handleSubmitPwd, formState: { errors: errorsPwd }, reset: resetPwd} = useForm({
        resolver: zodResolver(passwordSchema),
    });

    if (!user) {
        return <div className="text-center mt-5">Chargement du profil...</div>;
    }

    const isAdmin = user.role.includes("admin");

    const onSubmit = async (data: any) => {
        try {
            if (user._id) {
                await updateUserInfo(user._id, [
                    { property: "username", value: data.username },
                    { property: "email", value: data.email },
                    { property: "description", value: data.description },
                ]);
            };
            await checkAuth();
            setEditMode(false);
        } catch (error) {
            console.error(error);
        }
    };

    const onPasswordSubmit = async (data: any) => {
        try {
            if (user._id) {
                await updateUserInfo(user._id, [{ property: "password", value: data.password }]);
            };
            resetPwd();
            setEditPasswordMode(false);
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId); 
            setUserToDelete(null);
            logout();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    return (
        <>
            <div className="p-4 space-mob">
                <h1 className="mb-3 dash-title">Mon compte</h1>
            </div>

            <div className="bg-card">
                <div className="row gx-4">
                    <div className="col-12 col-md-8">
                        <div className="d-flex align-items-center gap-4 flex-wrap">
                            <img src={profilIcon} alt="Profile" className="img-fluid rounded-circle" style={{ width: '170px', height: '170px' }} />
                            <div>
                                <h2 className="text-white">{user.username}</h2>
                                <div className="d-flex dash-title">
                                    {isAdmin && (
                                        <p className="mb-0 btn-admin text-center me-2">admin</p>
                                    )}
                                    {user.isApproved ? (
                                        <span className="btnIsApproved bg-success">Approuvé</span>
                                    ) : (
                                        <span className="btnIsApproved btn-delete">Refusé</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="info-content text-white mt-4">
                            <p className="cust-marg-email">Email : {user.email}</p>
                            <p className="cust-marg-passw">Password : ***********</p>
                            {user.isBanned && (
                                <p className="mb-0 text-danger">⚠ Utilisateur banni</p>
                            )}
                        </div>

                        <div className="info-content text-white mt-4">
                            <p className="cust-marg-desc">Description : {user.description || "Aucune description"}</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="dash-title text-center bg-content-messages p-4 d-flex flex-column align-items-center h-100">
                            <div>
                                <h2>Messages en attente</h2>
                                <p className="cust-number">0</p>
                            </div>
                            <p className="cust-archive-txt mt-auto">Afficher l'historique de mes messages</p>
                        </div>
                    </div>
                </div>
            </div>

            {!user.isBanned && (
                <>
                    <div className="content-edit-password text-white">
                        <h3>Gestion Profil</h3>
                        <p className="dash-title">Modifier votre profil ici (email, pseudo, description, mot de passe, etc...)</p>

                        {editMode ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="mb-3">
                                <input {...register("username")} className="form-control mb-2" placeholder="Nom d'utilisateur" />
                                {errors.username && <p className="text-danger">{errors.username.message}</p>}

                                <input {...register("email")} className="form-control mb-2" placeholder="Email" />
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}

                                <input {...register("confirmEmail")} className="form-control mb-2" placeholder="Vérification Email" />
                                {errors.confirmEmail && <p className="text-danger">{errors.confirmEmail.message}</p>}

                                <textarea
                                    {...register("description")}
                                    className="form-control mb-2"
                                    placeholder="Votre description"
                                    rows={4}
                                />
                                {errors.description && <p className="text-danger">{errors.description.message}</p>}

                                <div className="d-flex">
                                    <button type="submit" className="btn btn-register-edit me-2">Enregistrer</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => { reset(); setEditMode(false); }}>Annuler</button>
                                </div>
                            </form>
                        ) : (
                            <button className="btn btn-edit" onClick={() => setEditMode(true)}>Modifier mon profil</button>
                        )}
                    </div>

                    <div className="content-edit-password text-white">
                        <h3>Gestion mot de passe</h3>
                        <p className="dash-title">Vous souhaitez changer votre mot de passe ?</p>

                        {editPasswordMode ? (
                            <form onSubmit={handleSubmitPwd(onPasswordSubmit)} className="mb-3">
                                <input type="password" {...registerPwd("password")} className="form-control mb-2" placeholder="Nouveau mot de passe" />
                                {errorsPwd.password && <p className="text-danger">{errorsPwd.password.message}</p>}
                                <input type="password" {...registerPwd("confirmPassword")} className="form-control mb-2" placeholder="Confirmer le mot de passe" />
                                {errorsPwd.confirmPassword && <p className="text-danger">{errorsPwd.confirmPassword.message}</p>}

                                <div className="d-flex">
                                    <button type="submit" className="btn btn-register-edit me-2">Enregistrer</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => { resetPwd(); setEditPasswordMode(false); }}>Annuler</button>
                                </div>
                            </form>
                        ) : (
                            <button className="btn btn-edit" onClick={() => setEditPasswordMode(true)}>Modifier mot de passe</button>
                        )}
                    </div>

                    <div className="content-delete text-white">
                        <h3>Suppression de mon compte</h3>
                        <p className="dash-title">La suppression de votre compte sera définitive.</p>
                        <button className="btn btn-delete" onClick={() => setUserToDelete(user)}>Supprimer mon compte</button>
                    </div>
                </>
            )}

            <ModalConfirm
                userToDelete={userToDelete}
                setUserToDelete={setUserToDelete}
                confirmDeleteUser={confirmDeleteUser}
            />
        </>
        
    );
};

export default Profil;