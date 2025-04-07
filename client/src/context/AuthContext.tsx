import { createContext, useContext, useState } from "react";
import { IUser } from "../models/IUser";
import { useNavigate } from "react-router-dom";

// Définition du contexte
interface AuthContextType {
    user: IUser | null;
    login: (email: string, password: string) =>  Promise<void>;
    logout: () =>  Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const navigate = useNavigate(); 

    // const checkAuth = async () => {
    //     try {
    //         const response = await fetch("http://localhost:3000/api/me", { credentials: "include" });

    //         if (!response.ok) throw new Error("Non authentifié");

    //         const data = await response.json();
    //         setUser(data); 
    //     } catch {
    //         setUser(null);
    //     }
    // };

    // useEffect(() => {
    //     checkAuth(); 
    // }, []);

    // Connexion
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });
    
            if (!response.ok) throw new Error("Échec de la connexion");
            console.log(response.headers);
            const data = await response.json();
            console.log("Utilisateur connecté :", data);
    
        } catch (error) {
            console.error(error);
        }
    };
    
    // Déconnexion
    const logout = async () => {
        try {
            await fetch("http://localhost:3000/api/logout", {
                method: "POST",
                credentials: "include"
            });
    
            setUser(null);
            console.log("Déconnecté !");
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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