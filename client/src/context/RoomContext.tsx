import { createContext, useContext, useEffect, useState } from "react";
import { IRoom } from "../models/IRoom";
import { getRooms } from "../api/services/roomService";

interface RoomContextType {
    rooms: IRoom[];
    refreshRooms: () => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
    const [rooms, setRooms] = useState<IRoom[]>([]);

    const refreshRooms = async () => {
        try {
        const res = await getRooms();
        const mappedRooms = res.data.map((element: any) => ({
            _id: element._id,
            name: element.name,
            description: element.description,
            picture: element.picture,
        }));
        setRooms(mappedRooms);
        } catch (error) {
        console.error("Erreur lors du chargement des salons :", error);
        }
    };

    useEffect(() => {
        refreshRooms();
    }, []);

    return (
        <RoomContext.Provider value={{ rooms, refreshRooms }}>
        {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error("useRoom doit être utilisé dans un RoomProvider");
    }
    return context;
};
