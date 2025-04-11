import { IMessage } from "../../models/IMessage";
import axiosAuth from "../axiosAuth";

export const getMessages = () => axiosAuth.get('/messages');
export const getMessageById = (id: string) => axiosAuth.get<IMessage>(`/messages/${id}`);
export const addMessage = () => axiosAuth.post<IMessage>('/messages');
export const deleteMessage = (id: string) => axiosAuth.delete(`/messages/${id}`);