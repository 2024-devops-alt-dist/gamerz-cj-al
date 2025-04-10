import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../models/IUser";
import { useNavigate } from "react-router-dom";
import { apiLogin, apiLogout, getUserInfo } from "../api/services/authService";

// Définition du contexte
interface AuthContextType {
    user: IUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => any;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            setIsLoading(false);
        };
        init();
    }, []);
    
    // Connexion
    const login = async (email: string, password: string) => {
        try {
            const response = await apiLogin(email, password);
    
            if (response.status !== 200) throw new Error("Échec de la connexion");
            
        } catch (error) {
            console.error(error);
        }
    };
    
    // Déconnexion
    const logout = async () => {
        try {
            await apiLogout();
    
            setUser(null);
            console.log("Déconnecté !");
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };
    

    const checkAuth = async () => {
        try {
            const response = await getUserInfo();
            if (response.status !== 200) throw new Error("Non authentifié");
            
            const data = response.data;
            const user = { 
                _id: data._id, 
                username: data.username,
                email: data.email,
                role: data.role,
                description: data.description,
                isApproved: data.isApproved,
                isBanned: data.isBanned,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }
            setUser(user);
        } catch {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour accéder au contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};