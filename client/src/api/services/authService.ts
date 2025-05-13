import axiosAuth from "../axiosAuth";
import axiosPublic from "../axiosPublic";


export const apiRegister = (username: string, email: string, password: string, description: string) => axiosPublic.post('/register', {
    username: username,
    email: email,
    password: password,
    description: description
});

export const apiLogin = (email: string, password: string) => axiosAuth.post('/login', {
    email: email,
    password: password
});

export const getUserInfo = () => axiosAuth.get('/me');

export const apiLogout = () => axiosAuth.get('/logout');