import { IUser } from "../../models/IUser";
import axiosAuth from "../axiosAuth";

export const getUsers = () => axiosAuth.get('/users');
export const getUserById = (id: string) => axiosAuth.get<IUser>(`/users/${id}`);
// export const addUser = () => axiosAuth.post<IUser>('/users');
export const addUser = (user : any) => axiosAuth.post<IUser>('/users', user);
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
export const updateUserBan = (_id: string, isBanned: boolean) =>
    axiosAuth.patch(`/users/${_id}`, 
        [
            {
                "property": "isBanned",
                "value": isBanned
            }
        ]
    );

export const updateUserInfo = (_id: string, updates: { property: string; value: string }[]) =>
    axiosAuth.patch(`/users/${_id}`, updates);