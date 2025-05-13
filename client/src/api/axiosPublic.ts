import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL + '/api/';

const axiosPublic = axios.create({
    baseURL: apiUrl,
});

export default axiosPublic;