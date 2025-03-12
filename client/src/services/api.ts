import axios from "axios";
import { IUser } from "../models/IUser";

const api = axios.create({
    url: 'http://localhost:3000/api',
})

export const getUsers = () => api.get<IUser[]>('/users');
export const getUsersId = (id: string) => api.get<IUser>(`/users/${id}`);
export const addUser = () => api.post<IUser>('/users');