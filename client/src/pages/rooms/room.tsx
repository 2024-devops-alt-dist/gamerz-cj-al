import React, { useEffect, useRef, useState } from 'react';
import { getRoomById } from '../../api/services/roomService';
import { IRoom } from '../../models/IRoom';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { IMessage } from '../../models/IMessage';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/room.css';
import { deleteMessage, getMessagesByRoomId } from '../../api/services/messageService';
import { Button } from 'react-bootstrap';
import Delete from '../../assets/pic⁫tures/delete.png';

const socket = io('http://localhost:3000');

const Room: React.FC = () => {
    
    const { id } = useParams(); 
    const { user } = useAuth();
    const [room, setRoom] = useState<IRoom>();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<IMessage[]>([]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
}, [chat]);

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

                // Récupérer les messages associés à la salle
                const messagesRes = await getMessagesByRoomId(id);
                setChat(messagesRes.data);
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

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage(messageId);
            // on marque localement le message comme supprimé
            setChat(prev =>
            prev.map(msg =>
                msg._id === messageId
                ? { ...msg, isDeleted: true }
                : msg
            )
            );
        } catch (err) {
            console.error("Impossible de supprimer le message :", err);
        }
    };
    
    return (
        <>
        <div className="chat-room-container d-flex flex-column">
            <div className="p-4 space-mob">
                <h1 className="mb-3 dash-title">{room.name}</h1>
                <p className="dash-subTitle">{room.description}</p>
            </div>

            <div className="chat-messages p-4 mb-4">
                {chat.map((msg, i) => {
                    const isCurrentUser = msg.user && user && msg.user._id === user._id;
                    let customClass = '';
                    if (!msg.user) {
                        customClass = 'message-deleted';
                    } else if (isCurrentUser) {
                        customClass = 'message-user';
                    } else {
                        customClass = 'message-other';
                    }

                    const contentClass = msg.user ? 'space-cust' : 'space-deleted';

                    return (
                        <div key={i} className={`mb-2 d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`text-white d-flex align-items-start p-2 rounded ${customClass}`} style={{ maxWidth: '70%' }}>
                                <div className={contentClass}>
                                    {msg.isDeleted ? (
                                        <div className="fst-italic dash-title delete-user-mess">
                                            {msg.user ? (
                                                <span>{msg.user.username} a supprimé ce message</span>
                                            ) : (
                                                <span>Message indisponible – utilisateur supprimé</span>
                                            )}
                                        </div>
                                    ) : msg.user ? (
                                        <>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong>{msg.user.username}</strong>
                                                <span className="small ms-5">
                                                    {msg.createdAt
                                                    ? new Date(msg.createdAt).toLocaleString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : ''}
                                                </span>
                                            </div>
                                            <div>{msg.content}</div>
                                        </>
                                    ) : (
                                        <div className="fst-italic dash-title delete-user-mess">
                                            Message indisponible – utilisateur supprimé
                                        </div>
                                    )}
                                </div>

                                {!msg.isDeleted && msg.user && user && msg.user._id === user._id && msg._id && (
                                    <Button className="d-flex justify-content-center align-items-center bg-trash-cust border-0 ms-2" style={{ width: '30px', height: '30px' }} onClick={() => handleDeleteMessage(msg._id!)}>
                                        <img src={Delete} alt="icon delete" style={{ width: '15px', height: '15px' }} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container d-flex align-items-center px-3 mb-1">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                    Envoyer
                </button>
            </div>
        </div>
        </>
        
    );
};

export default Room;