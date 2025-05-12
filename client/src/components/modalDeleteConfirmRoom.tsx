import React from 'react';
import { IRoom } from '../models/IRoom';

interface ModalConfirmPropsRoom {
    roomToDelete?: IRoom | null;
    setRoomToDelete: React.Dispatch<React.SetStateAction<IRoom | null>>;
    confirmDeleteRoom: (roomId: string) => Promise<void>;
}

const ModalConfirmRoom: React.FC<ModalConfirmPropsRoom> = ({ roomToDelete, setRoomToDelete, confirmDeleteRoom }) => {
    if (!roomToDelete) return null; 

    return (
        <div className="modal-backdrop">
            <div className="modal-confirm">
                <h5>Confirmation</h5>
                <p>Es-tu sûre de vouloir supprimer le salon "<strong>{roomToDelete.name}</strong>" ? Cette action est irréversible.</p>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" onClick={() => setRoomToDelete(null)}>Annuler</button>
                    <button className="btn btn-danger2" onClick={() => confirmDeleteRoom(roomToDelete._id)}>Supprimer</button>
                </div>
            </div>
        </div>
    );
};


export default ModalConfirmRoom;
