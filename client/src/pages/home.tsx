// Cette page peut être le dashboard affiché aux admins seulement
import '../assets/styles/global.css';
import '../assets/styles/dashboard.css';
import React, { useState } from 'react';
import { IUser } from '../models/IUser';
import { useAuth } from '../context/AuthContext';
import Check from '../assets/pic⁫tures/check.png';
import Close from '../assets/pic⁫tures/close.png';
//import logoIcon from '../assets/pic⁫tures/loco-icon.png';
// import { useAuth } from '../context/AuthContext';
// import { getUser } from '../services/api';
// import { AuthContext } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';

const Home: React.FC = () => {
    const { user } = useAuth();

    // console.log('infos user :', user);

    // const auth = useContext(AuthContext);
    // const { login } = useAuth();
    // const [userId, setUserId] = useState<string | null>(null);
    
    // if (!auth || !auth.user) {
    //     return <Navigate to="/login" />;
    // }
    
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const response = await getUser();
    //             setUserId(response.data.userId);
    //         } catch (error) {
    //             setUserId(null);
    //         }
    //     };
    //     fetchUser();
    // }, []);

    const users: IUser[] = [
        {
            id: '1',
            username: 'Althan Travis',
            email: 'althan@example.com',
            role: ['user'],
            description: 'Passionné par les mondes ouverts et les aventures palpitantes, je suis un joueur assidu d\'Assassin\'s Creed. J\'adore plonger dans des histoires riches et immersives tout en explorant des paysages magnifiques. Rejoindre un salon de discussion sur ce jeu serait l\'occasion de partager ma passion et d\'échanger des astuces avec d\'autres fans.',
            isApproved: true,
            isBanned: false,
            password: 'hashedPassword123'
        },
        {
            id: '2',
            username: 'Tomo Arvis',
            email: 'tomo@example.com',
            role: ['user'],
            description: 'Minecraft est mon terrain de jeu préféré ! Que ce soit pour construire des mondes imaginaires ou affronter des créatures dans des aventures épiques, ce jeu me permet d\'exprimer ma créativité tout en restant connecté à une communauté dynamique. J\'aimerais échanger avec d\'autres joueurs pour découvrir de nouvelles astuces et projets.',
            isApproved: true,
            isBanned: false,
            password: 'hashedPassword456'
        },
        {
            id: '3',
            username: 'Travis Head',
            email: 'travis@example.com',
            role: ['user'],
            description: 'Witcher 3 a transformé ma vision des RPG avec ses personnages profonds et ses quêtes fascinantes. J\'ai passé des heures à parcourir les terres de Temeria et je suis toujours à la recherche de discussions passionnantes sur l\'univers de Geralt. Ce salon est l\'endroit idéal pour rencontrer d\'autres fans et échanger sur les meilleurs moments du jeu.',
            isApproved: true,
            isBanned: false,
            password: 'hashedPassword789'
        },
        {
            id: '4',
            username: 'Sarah Miller',
            email: 'sarah@example.com',
            role: ['user'],
            description: 'Les jeux vidéo sont bien plus qu\'une simple passion pour moi, c\'est un moyen d\'évasion. Assassin\'s Creed m\'a permis de découvrir des époques fascinantes tout en défiant mes compétences de joueur. Partager mes expériences avec d\'autres passionnés et apprendre de nouvelles stratégies est quelque chose que j\'attends avec impatience.',
            isApproved: true,
            isBanned: false,
            password: 'hashedPassword101'
        },
        {
            id: '5',
            username: 'John Doe',
            email: 'john@example.com',
            role: ['user'],
            description: 'Minecraft est une véritable source d\'inspiration pour moi. Construire, explorer et collaborer avec d\'autres joueurs est ce qui me motive à me plonger toujours plus dans ce monde en perpétuelle évolution. Je suis impatient de rejoindre ce salon pour découvrir de nouvelles créations et stratégies avec d\'autres fans du jeu.',
            isApproved: false,
            isBanned: false,
            password: 'hashedPassword102'
        }
    ];
    
    const handleApprovalChange = (userId: string, approved: boolean) => {
        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, isApproved: approved } : user
        );
        //setUsers(updatedUsers); 
    
        // Pour envoyer modif au backend ???
        // Ex: axios.put(`/api/users/${userId}`, { isApproved: approved });
    };

     // Fonction pour gérer l'affichage de la description
    const truncateDescription = (description: string, maxLength: number) => {
        if (description.length <= maxLength) return description;
        return description.slice(0, maxLength) + '...';
    };
    
    return (
        <>
        <div className="p-4">
            <h1 className="mb-5 dash-title">Dashboard - Bienvenue (pseudo) !</h1>
            <h2 className="mb-4 dash-subTitle">Voici les demandes du jour :</h2>

            <div className="table-content">
                <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr className="">
                            
                            <th scope="col" className="col-2">Pseudo</th>
                            <th scope="col" className="col-3">Email</th>
                            <th scope="col" className="col-6">Description</th>
                            <th scope="col" className="col-1">Approved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            const [isExpanded, setIsExpanded] = useState(false);
                            const descriptionToDisplay = isExpanded ? user.description : truncateDescription(user.description, 150);

                            return (
                                <tr key={`${user.username}-${index}`}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div>
                                            {descriptionToDisplay}
                                            {user.description.length > 150 && (
                                                <button onClick={() => setIsExpanded(!isExpanded)} className="btn btn-link btn-sm text-decoration-none">
                                                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2 align-items-center">
                                            <button className="btn btn-success btn-sm" onClick={() => handleApprovalChange(user.id, true)}>
                                                <img src={Check} alt="Approve" style={{ width: "20px", height: "20px" }} />
                                            </button>

                                            <button className="btn btn-danger btn-sm" onClick={() => handleApprovalChange(user.id, false)}>
                                                <img src={Close} alt="Reject" style={{ width: "20px", height: "20px" }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {/* Mettre en place une condition, si aucune demande en attente mettre un message dans le tableau "Vous êtes jour ! Aucune demande en attente" */}
        </div>

        {/* <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>

            {user ? (
                <div>
                    <p>Bienvenue, <strong>{user.email}</strong> !</p>
                    <p>Rôle : <strong>{user.role}</strong></p>
                </div>
            ) : (
                <p>Chargement des informations utilisateur...</p>
            )}
        </div> */}

        {/* <div className="">
            <h1 className="mb-4">Home Page</h1>
            {/* {userId ? <p>Utilisateur connecté : {userId}</p> : <p>Veuillez vous connecter.</p>} 
        </div> */}
        </>
        
    );
};

export default Home;