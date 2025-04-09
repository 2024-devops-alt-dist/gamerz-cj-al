import axios from "axios";
import { IUser } from "../models/IUser";

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
})

export const getUsers = () => api.get('/users');
export const getUsersId = (id: string) => api.get<IUser>(`/users/${id}`);
export const addUser = () => api.post<IUser>('/users');

export const getUserToken = () => api.get('/me');

export const updateUserApproval = (_id: string, isApproved: boolean) =>
    api.patch(`/users/${_id}`, 
        [
            {
                "property": "isApproved",
                "value": isApproved
            }
        ]
    );