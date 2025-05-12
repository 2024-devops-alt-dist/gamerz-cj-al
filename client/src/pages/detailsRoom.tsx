import React, { useEffect, useState } from "react";
import { IRoom } from "../models/IRoom";
import { deleteRoom, getRoomById } from "../api/services/roomService";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import Delete from '../assets/pic⁫tures/delete.png';
import ModalConfirmRoom from "../components/modalDeleteConfirmRoom";
import Edit from '../assets/pic⁫tures/edit.png';

const DetailsRoom: React.FC = () => {
    const { id } = useParams();
    const [room, setRoom] = useState<IRoom | null>(null);
    const [roomToDelete, setRoomToDelete] = useState<IRoom | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                if (id) {
                    const response = await getRoomById(id);
                    setRoom(response.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du salon :", error);
            }
        };

        fetchRoom();
    }, [id]);

    const confirmDeleteRoom = async (roomId: string) => {
            try {
                await deleteRoom(roomId);
                setRoom(null);
                setRoomToDelete(null);
                navigate('/home');
            } catch (error) {
                console.error("Erreur lors de la suppression du salon :", error);
            }
        };

    if (!room) {
        return <div>Chargement...</div>;
    }
        
    return (
        <>
            <div className="p-4 dash-title">
                <div className="d-flex justify-content-between mb-5">
                    <h1>Détail du salon</h1>

                    <div className="d-flex gap-3">
                        <Button className="btn btn-secondary btn-menu position-relative" onClick={() => navigate(`/rooms/${room._id}/edit`)}>
                            <img src={Edit} alt="icon edit" style={{ width: '19px', height: '19px' }}/>
                            <span className="btn-text">Modifier</span>
                        </Button>
                        <Button className="d-flex justify-content-center align-items-center bg-danger border-0" style={{ width: '38px', height: '38px' }} onClick={() => setRoomToDelete(room)}>
                            <img src={Delete} alt="icon delete" style={{ width: '19px', height: '19px' }} />
                        </Button>
                    </div>
                </div>

                <div className="space-y-3 mt-4">
                    <div className="row">
                        <div className="col-md-4 text-center">
                            {room.picture ? (
                                <>
                                    <img
                                        src={`http://localhost:3000/uploads/${room.picture}`}
                                        alt="Image du salon"
                                        className="img-fluid rounded mb-2"
                                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                                    />
                                </>
                            ) : (
                                <div className="text-muted">Aucune image associée</div>
                            )}
                        </div>

                        <div className="col-md-8">
                            <h5>Nom du salon</h5>
                            <p>{room.name}</p>

                            <h5>Description</h5>
                            <p>{room.description || "Aucune description."}</p>
                        </div>

                        
                    </div>
                </div>
            </div>

            <ModalConfirmRoom 
                roomToDelete ={roomToDelete } 
                setRoomToDelete={setRoomToDelete} 
                confirmDeleteRoom={confirmDeleteRoom} 
            />
        </>
    );
};

export default DetailsRoom;