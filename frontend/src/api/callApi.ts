import axios, { type AxiosInstance } from 'axios';
import { getAccessToken, removeAccessToken } from '../utils/localStorage';

function createAxiosInstance(baseURL: string): AxiosInstance {
    const instance = axios.create({
        baseURL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config) => {
            const token = getAccessToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response.data;
        },
        (error) => {
            const status = error.response?.status;

            if (status === 401) {
                removeAccessToken();
                return Promise.reject(error);
            } else if (status === 403 || status === 404) {
                // TODO: Redirect logic khi bị lỗi phân quyền hoặc không tìm thấy
                console.error(`Error ${status}: `, error.response?.data?.message);
            }

            // Đối với status 422, nếu bạn muốn không throw error mà trả về data luôn (như code cũ)
            if (status === 422) {
                return Promise.resolve(error.response.data);
            }

            // Ném lỗi ra ngoài để createAsyncThunk có thể catch được
            return Promise.reject(error);
        }
    );

    return instance;
}



// Gateway URL - single entry point for all services
const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;
// Tạo các API client thuần túy
export const beApi = createAxiosInstance(
    GATEWAY_URL ? `${GATEWAY_URL}/api/v1/` : '/api/v1/',
);
