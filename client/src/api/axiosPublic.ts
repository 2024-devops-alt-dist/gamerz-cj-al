import axios from "axios";

const apiUrl = 'http://localhost:3000/api/';

const axiosPublic = axios.create({
    baseURL: apiUrl,
});

export default axiosPublic;