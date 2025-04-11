import React, { useEffect, useState } from 'react';
import { getRoomById } from '../../api/services/roomService';
import { IRoom } from '../../models/IRoom';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { IMessage } from '../../models/IMessage';
import { useAuth } from '../../context/AuthContext';

const socket = io('http://localhost:3000');

const Room: React.FC = () => {
    
    const { id } = useParams(); 
    const { user } = useAuth();
    const [room, setRoom] = useState<IRoom>();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<IMessage[]>([]);

    useEffect(() => {
        fetchRoom();
    }, [id]);

    useEffect(() => {
        console.log(room);
        joinRoom(room?._id);
        socket.on('receive_message', (msg: IMessage) => {
            console.log(msg);
            setChat((prevChat) => {
                const updatedChat = [...prevChat, msg];
                return updatedChat;
            });
        });
        return () => {
            socket.off('receive_message');
        };
    }, [room])

    const fetchRoom = async () => {
        try {
            if (id) {
                const res = await getRoomById(id);
                const resRoom = {
                    _id: res.data._id,
                    name: res.data.name,
                    description: res.data.description,
                    picture: res.data.picture
                }
                setRoom(resRoom);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la salle :", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = () => {
        console.log(message);
        const sendedMessage: IMessage = {
            content: message,
            user: user ? user : null,
            room: room ? room : null
        };
        socket.emit('send_message', { roomId: room?._id, sendedMessage });
        setMessage('');
    };
    
    const joinRoom = (roomId: string | undefined) => {
        socket.emit('join_room', roomId);
    };

    if (loading) return <p>Chargement...</p>;
    if (!room) return <p>Salle introuvable.</p>;
    
    return (
        <>
        <div>
            <h1>{room.name}</h1>
            <p>Description : {room.description}</p>
            <div>
                <div>
                    {chat.map((msg, i) => (
                        <p key={i} style={{color: 'white'}}>
                            <strong>{msg.user?.username}</strong>{'  '}
                            {msg.createdAt ? msg.createdAt.toLocaleString() : ''}{'  '}
                            {msg.content}
                        </p>
                    ))}
                </div>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message..."
                />
                <button onClick={sendMessage}>Envoyer</button>
            </div>
        </div>
        </>
        
    );
};

export default Room;