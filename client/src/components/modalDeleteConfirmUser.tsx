import React from 'react';
import { IUser } from '../models/IUser';

interface ModalConfirmProps {
    userToDelete: IUser | null;
    setUserToDelete: React.Dispatch<React.SetStateAction<IUser | null>>;
    confirmDeleteUser: (userId: string) => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ userToDelete, setUserToDelete, confirmDeleteUser }) => {
    if (!userToDelete) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-confirm">
                <h5>Confirmation</h5>
                <p>Es-tu sûre de vouloir supprimer le compte <strong>{userToDelete.username}</strong> ? Cette action est irréversible.</p>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" onClick={() => setUserToDelete(null)}>Annuler</button>
                    <button className="btn btn-danger2" onClick={() => confirmDeleteUser(userToDelete._id)}>Supprimer</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirm;
