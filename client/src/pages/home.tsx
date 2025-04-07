// Cette page peut être le dashboard affiché aux admins seulement

import React from 'react';
//import logoIcon from '../assets/pic⁫tures/loco-icon.png';
// import { useAuth } from '../context/AuthContext';
// import { getUser } from '../services/api';
// import { AuthContext } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';

const Home: React.FC = () => {
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
    
    return (
        <>
        <div className="">
            <h1 className="mb-4">Home Page</h1>
            {/* {userId ? <p>Utilisateur connecté : {userId}</p> : <p>Veuillez vous connecter.</p>} */}
        </div>
        </>
        
    );
};

export default Home;