import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosAuth = axios.create({
    baseURL: apiUrl,
    withCredentials: true
});

// axiosAuth.interceptors.response.use(
//     (response: AxiosResponse) => {
//         return response;
//     }, 
//     async (error: AxiosError) => {
//         const originalReq = error.config as AxiosRequestConfig;
//         console.log('originalReq', originalReq);
//         if (error.response?.status === 401) {
//             try {
//                 // Appel à l'API de refresh token
//                 const refreshResponse = await axios.get('/refresh', { withCredentials: true });
//                 console.log('refresh', refreshResponse.status);
//                 if (refreshResponse.status === 200) {
//                     const newRes = axios(originalReq);
//                     console.log('new res', await newRes);
                
//                     return newRes;
//                 }
//             } catch (refreshError) {
//               return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
    
// );

export default axiosAuth;