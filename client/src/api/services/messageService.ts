import { IMessage } from "../../models/IMessage";
import axiosAuth from "../axiosAuth";

export const getMessages = () => axiosAuth.get('/messages');
export const getMessageById = (id: string) => axiosAuth.get<IMessage>(`/messages/${id}`);
export const addMessage = () => axiosAuth.post<IMessage>('/messages');
export const deleteMessage = (id: string) =>
  axiosAuth.patch<IMessage>(`/messages/${id}`, [
    { property: 'isDeleted', value: true }
  ]);
export const getMessagesByRoomId = (roomId: string) => axiosAuth.get<IMessage[]>(`/messages/room/${roomId}`);
