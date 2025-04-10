import { IRoom } from "../../models/IRoom";
import axiosAuth from "../axiosAuth";

export const getRooms = () => axiosAuth.get('/rooms');
export const getRoomById = (id: string) => axiosAuth.get<IRoom>(`/rooms/${id}`);
export const addRoom = () => axiosAuth.post<IRoom>('/rooms');
export const deleteRoom = (id: string) => axiosAuth.delete(`/rooms/${id}`);