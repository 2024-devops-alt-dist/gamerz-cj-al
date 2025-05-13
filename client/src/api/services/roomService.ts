import { IRoom } from "../../models/IRoom";
import axiosAuth from "../axiosAuth";

export const getRooms = () => axiosAuth.get('/rooms');
export const getRoomById = (id: string) => axiosAuth.get<IRoom>(`/rooms/${id}`);
export const addRoom = (room: FormData) => axiosAuth.post<IRoom>('/rooms', room);
export const deleteRoom = (id: string) => axiosAuth.delete(`/rooms/${id}`);

export const updateRoom = (id: string, data: any) => axiosAuth.patch(`/rooms/${id}`, data);
