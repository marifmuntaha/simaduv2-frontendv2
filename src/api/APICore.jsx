import axios from 'axios'
import { RToast } from "@/components";

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['ngrok-skip-browser-warning'] = true;
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;

class APICore {

    constructor() {
        const user = this.getLoggedInUser()
        if (user) {
            this.setAuthorization(user)
        }
    }

    get = async (url, params) => {
        let response
        if (params) {
            const queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : ''
            response = await axios.get(`${url}?${queryString}`, params).then((resp) => resp);
        } else {
            response = await axios.get(`${url}`, params).then((resp) => resp)
        }
        return this.handleResponse(response)
    }

    getFile = (url, params) => {
        let response
        if (params) {
            const queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : ''
            response = axios.get(`${url}?${queryString}`, {responseType: 'blob'})
        } else {
            response = axios.get(`${url}`, {responseType: 'blob'})
        }
        return response
    }

    getMultiple = (urls, params) => {
        const reqs = []
        let queryString = ''
        if (params) {
            queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : ''
        }

        for (const url of urls) {
            reqs.push(axios.get(`${url}?${queryString}`))
        }
        return axios.all(reqs)
    }

    create = async (url, data, message) => {
        const response = await axios.post(url, data).then((resp) => resp).catch((error) => error);
        return this.handleResponse(response, message)
    }

    updatePatch = (url, data) => {
        return axios.patch(url, data)
    }

    update = async (url, data, message) => {
        const response =  await axios.put(url, data).then((resp) => resp).catch((error) => error);
        return this.handleResponse(response, message);
    }

    delete = async (url, message) => {
        const response = await axios.delete(url).then((resp) => resp);
        return this.handleResponse(response, message)
    }

    createWithFile = async (url, data, message) => {
        const formData = new FormData()
        for (const k in data) {
            if (Array.isArray(data[k])) {
                for (const key in data[k]) {
                    formData.append(`${k}[]`, data[k][key])
                }
            } else {
                formData.append(k, data[k])
            }
        }

        const config = {
            headers: {
                ...axios.defaults.headers.common,
                'content-type': 'multipart/form-data',
            },
        }
        const result =  await axios.post(url, formData, config).then((resp) => resp).catch((error) => error);
        return this.handleResponse(result, message);
    }

    updateWithFile = async (url, data, message) => {
        const formData = new FormData()
        for (const k in data) {
            if (Array.isArray(data[k])) {
                for (const key in data[k]) {
                    formData.append(`${k}[]`, data[k][key])
                }
            } else {
                formData.append(k, data[k])
            }
        }
        formData.append('_method', 'put')
        const config = {
            headers: {
                ...axios.defaults.headers.common,
                'content-type': 'multipart/form-data',
            },
        }
        const result =  await axios.post(url, formData, config).then((resp) => resp).catch((error) => error);
        return this.handleResponse(result, message);
    }

    isUserAuthenticated = () => {
        return this.getLoggedInUser();
    }

    setLoggedInUser = (session) => {
        session
            ? localStorage.setItem('user', JSON.stringify(session))
            : localStorage.removeItem('user')
    }

    getLoggedInUser = () => {
        const user = localStorage.getItem('user')
        return user ? (typeof user == 'object' ? user : JSON.parse(user)) : false
    }

    setUserInSession = (modifiedUser) => {
        const userInfo = localStorage.getItem('user')
        if (userInfo) {
            const {token, user} = JSON.parse(userInfo)
            this.setLoggedInUser({token: token, user: user, subscription: modifiedUser})
        }
    }

    setAuthorization = (auth) => {
        if (auth) axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.token
        else delete axios.defaults.headers.common['Authorization']
    }

    handleResponse = (resp, message = true) => {
        const {code, data, response} = resp;
        if (code === "ERR_NETWORK") {
            RToast('Tidak dapat terhubung ke server.');
        }
        else if (response) {
            const {statusMessage, statusCode} = response.data;
            if (statusCode === 401) {
                RToast(statusMessage)
                this.setLoggedInUser();
                return false;
            } else if (statusCode === 403) {
                RToast('Anda tidak berhak mengakses halaman ini.')
            } else {
                message && RToast(statusMessage);
                return false;
            }
        } else {
            const {status, statusMessage, statusCode, result} = data;
            if (status === 'success') {
                statusMessage !== '' && message && RToast(statusMessage, 'success');
                return result;
            } else {
                if (statusCode === 401) {
                    RToast(statusMessage);
                    this.setLoggedInUser();
                    return false;
                } else {
                    RToast(statusMessage);
                    return false;
                }
            }
        }
    }
}

export {APICore}
