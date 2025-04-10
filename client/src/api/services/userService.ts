import { IUser } from "../../models/IUser";
import axiosAuth from "../axiosAuth";

export const getUsers = () => axiosAuth.get('/users');
export const getUserById = (id: string) => axiosAuth.get<IUser>(`/users/${id}`);
export const addUser = () => axiosAuth.post<IUser>('/users');
export const deleteUser = (id: string) => axiosAuth.delete(`/users/${id}`);
export const updateUserApproval = (_id: string, isApproved: boolean) =>
    axiosAuth.patch(`/users/${_id}`, 
        [
            {
                "property": "isApproved",
                "value": isApproved
            }
        ]
    );