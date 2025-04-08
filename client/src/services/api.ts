import axios from "axios";
import { IUser } from "../models/IUser";

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const getUsers = () => api.get<IUser[]>('/users');
export const getUsersId = (id: string) => api.get<IUser>(`/users/${id}`);
export const addUser = () => api.post<IUser>('/users');

export const getUserToken = () => api.get('/me');