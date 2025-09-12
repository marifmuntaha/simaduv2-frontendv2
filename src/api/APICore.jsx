import axios from 'axios'
import { RToast } from "@/components";

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
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
            response = await axios.get(`${url}?${queryString}`, params).then((resp) => {
                return {
                    result: resp.data.result,
                }
            }).catch((error) => this.handleError(error))
        } else {
            response = await axios.get(`${url}`, params).then((resp) => {
                return {
                    result: resp.data.result,
                }
            }).catch((error) => this.handleError(error))
        }
        return response
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

    create = (url, data) => {
        return axios.post(url, data).then((resp) => {
            return {
                message: resp.data.message,
                result: resp.data.result,
            }
        }).catch((error) => {
            this.handleError(error)
        })
    }

    updatePatch = (url, data) => {
        return axios.patch(url, data)
    }

    update = async (url, data) => {
        return await axios.put(url, data).then((resp) => {
            return {
                message: resp.data.message,
                result: resp.data.result,
            }
        }).catch((error) => {
            this.handleError(error)
            throw new Error()
        })
    }

    delete = (url) => {
        return axios.delete(url).then((resp) => {
            return {
                message: resp.data.message,
                result: resp.data.result,
            }
        }).catch((error) => {
            this.handleError(error)
            throw new Error()
        })
    }

    createWithFile = (url, data) => {
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
        return axios.post(url, formData, config).then((resp) => {
            return {
                message: resp.data.message,
                result: resp.data.result
            }
        }).catch((error) => {
            this.handleError(error)
            throw new Error()
        })
    }

    updateWithFile = (url, data) => {
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
        return axios.post(url, formData, config).then((resp) => {
            return {
                message: resp.data.message,
                result: resp.data.result
            }
        }).catch((error) => {
            this.handleError(error)
            throw new Error()
        })
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

    handleError(error) {
        const {code, response} = error
        let message = ''
        if (code === "ERR_NETWORK") {
            message = 'Tidak dapat terhubung ke server.'
        } else {
            if (response.status === 401) {
                this.setLoggedInUser();
                window.location.href = '/auth/masuk'
            }
            if (response.data){
                if (response.data.messages) {
                    response.data.messages.map(item => {
                        message += item.message + ', '
                    })
                } else {
                    message = response.data.message
                }
            } else {
                message = response.message
            }
        }
        RToast(message)
    }
}

export {APICore}