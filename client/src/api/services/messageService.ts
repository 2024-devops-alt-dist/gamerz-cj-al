import { IMessage } from "../../models/IMessage";
import axiosAuth from "../axiosAuth";

export const getMessages = () => axiosAuth.get('/messages');
export const getRoomById = (id: string) => axiosAuth.get<IMessage>(`/messages/${id}`);
export const addRoom = () => axiosAuth.post<IMessage>('/messages');
export const deleteRoom = (id: string) => axiosAuth.delete(`/messages/${id}`);