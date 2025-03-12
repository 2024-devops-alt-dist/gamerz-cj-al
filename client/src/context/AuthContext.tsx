import { createContext, useContext, useState } from "react";
// import { IUser } from "../models/IUser";

// Définition du contexte
interface AuthContextType {
    // user: IUser | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Connexion
    const login = (email: string, password: string) => {
        console.log("Connexion avec :", email, password);
        setIsAuthenticated(true);
    };

    // Déconnexion
    const logout = () => {
        console.log("Déconnexion");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};