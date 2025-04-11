import React, { useEffect, useState } from 'react';
import { getRoomById } from '../../api/services/roomService';
import { IRoom } from '../../models/IRoom';
import { useParams } from 'react-router-dom';

const Room: React.FC = () => {
    
    const { id } = useParams(); 
    const [room, setRoom] = useState<IRoom | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                if (id) {
                    const res = await getRoomById(id);
                    setRoom(res.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la salle :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (!room) return <p>Salle introuvable.</p>;
    
    return (
        <>
        <div>
            <h1>{room.name}</h1>
            <p>Description : {room.description}</p>
        </div>
        </>
        
    );
};

export default Room;