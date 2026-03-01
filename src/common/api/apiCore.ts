import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import { RToast } from "@/components";
import { ApiResponse, LoggedInUser, ApiParams, ApiData } from '../types/api';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;

class apiCore {
    constructor() {
        const token = this.getLoggedInToken();
        if (token) {
            this.setAuthorization(token);
        }
    }

    async get<T>(url: string, params?: ApiParams, notification: boolean = false): Promise<ApiResponse<T>> {
        const response = await axios.get(url, { params });
        return this.handleResponse<T>(response, notification);
    }

    getFile = (url: string, params?: ApiParams) => {
        return axios.get(url, { params, responseType: 'blob' });
    }

    getMultiple = (urls: string[], params?: ApiParams) => {
        const reqs = urls.map(url => axios.get(url, { params }));
        return Promise.all(reqs);
    }

    async create<T>(url: string, data: ApiData, message: boolean = true): Promise<ApiResponse<T>> {
        const response: AxiosResponse | AxiosError = await axios.post(url, data).catch((error => error))
        return this.handleResponse<T>(response, message);

    }

    updatePatch = (url: string, data: ApiData) => {
        return axios.patch(url, data);
    }

    async update<T>(url: string, data: ApiData, message: boolean = true){
        const response = await axios.put(url, data).catch((error) => error);
        return this.handleResponse<T>(response, message);
    }

    delete = async (url: string, message: boolean = true) => {
        try {
            const response = await axios.delete(url);
            return this.handleResponse(response, message);
        } catch (error: any) {
            return this.handleResponse(error, message);
        }
    }

    private prepareFormData = (data: ApiData) => {
        const formData = new FormData();
        for (const k in data) {
            if (Array.isArray(data[k])) {
                data[k].forEach((val: any) => formData.append(`${k}[]`, val));
            } else {
                formData.append(k, data[k]);
            }
        }
        return formData;
    }

    async createWithFile<T>(url: string, data: ApiData, message: boolean = true){
        const formData = this.prepareFormData(data);
        const config: AxiosRequestConfig = {
            headers: {
                ...axios.defaults.headers.common,
                'content-type': 'multipart/form-data',
            },
        };
        const response = await axios.post(url, formData, config).catch((error) => error);
        return this.handleResponse<T>(response, message);
    }

    async updateWithFile<T>(url: string, data: ApiData, message: boolean = true){
        const formData = this.prepareFormData(data);
        formData.append('_method', 'put');
        const config: AxiosRequestConfig = {
            headers: {
                ...axios.defaults.headers.common,
                'content-type': 'multipart/form-data',
            },
        };
        const response = await axios.post(url, formData, config).catch((error) => error);
        return this.handleResponse<T>(response, message);
    }

    isUserAuthenticated = () => {
        return !!this.getLoggedInToken();
    }

    setLoggedInToken = (session?: LoggedInUser | undefined) => {
        if (session?.token !== undefined) {
            localStorage.setItem('__SIMADU_USER_TOKEN__', session.token);
        } else {
            localStorage.removeItem('__SIMADU_USER_TOKEN__');
        }
    }

    getLoggedInToken = (): string | false => {
        const token = localStorage.getItem('__SIMADU_USER_TOKEN__');
        return token ? token : false
    }

    setAuthorization = (token: string | null) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    handleResponse<T>(resp: AxiosResponse|AxiosError, notification: boolean = true): ApiResponse<T> {
        const { code, data } = resp as AxiosResponse & AxiosError;
        if (data) {
            const { status, statusMessage, result } = data;
            if (status === 'success') {
                if (statusMessage !== '' && notification) RToast(statusMessage, 'success');
                return {status: 'success', statusMessage: statusMessage, result: result as T};
            } else {
                if (statusMessage !== '' && notification) RToast(statusMessage);
                return {status: 'error', statusMessage: statusMessage, result: result as T};
            }
        } else {
            if (code === "ERR_NETWORK") {
                if(notification) RToast('Aplikasi tidak terhubung ke server.');
                return {status: 'error', statusMessage: 'Aplikasi tidak terhubung ke server.', result: null as T};
            } else {
                const {response}: any = resp as AxiosResponse & AxiosError;
                if (response) {
                    switch (response.status) {
                        case 401:
                            if(notification) RToast(response.data?.statusMessage ? response.data.statusMessage : "Sesi anda telah berakhir: Silakan masuk lagi.");
                            return {status: 'error', statusMessage: "Sesi anda telah berakhir: Silakan masuk lagi.", result: null as T};
                        case 403:
                            if(notification) RToast("Anda tidak memiliki izin untuk mengakses sumber daya ini.");
                            return {status: 'error', statusMessage: "Anda tidak memiliki izin untuk mengakses sumber daya ini.", result: null as T};
                        case 422:
                            if(notification) RToast(response.data.statusMessage);
                            return {status: 'error', statusMessage : response.data.statusMessage, result: null as T };
                        case 500:
                            if(notification) RToast("Server error, silahkan ulangi lagi.");
                            return {status: 'error', statusMessage: "Server error, silahkan ulangi lagi.", result: null as T};
                        default:
                            if(notification) RToast("Server error, silahkan ulangi lagi.");
                            return {status: 'error', statusMessage: response.data.message || 'Kesalahan tidak diketahui', result: null as T};
                    }
                } else {
                    if(notification) RToast("Kesalahan Jaringan: Tidak ada respons dari server");
                    return {status: 'error', statusMessage: 'Kesalahan Jaringan: Tidak ada respon dari server', result: null as T};
                }
            }
        }
    }
}

export { apiCore };
