import axios from 'axios';

export const api = axios.create({
    baseURL:  import.meta.env.VITE_API_URL || 'http://localhost:4001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Para habilitar cookies para despues
});

// Inerceptor para agregar token en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejo global de errores
        if (error.response) {
            if (error.response.status === 401) {
                // Redirigir o refrescar token
                console.error('Unauthorized');
            }
        }
        return Promise.reject(error);
    }
);