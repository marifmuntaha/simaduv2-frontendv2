import {APICore} from './APICore.jsx'
import {RToast} from "@/components";

const api = new APICore()

function login(params) {
    const baseUrl = '/auth/login'
    return api.create(baseUrl, params).then((resp) => {
        const {message, result} = resp
        api.setLoggedInUser(result);
        api.setAuthorization(result.user);
        RToast(message, 'success');
    }).catch(() => {
        throw new Error()
    })
}

function logout() {
    const baseUrl = '/auth/logout'
    return api.create(`${baseUrl}`).then((resp) => {
        const {message} = resp;
        RToast(message, 'success');
        api.setLoggedInUser();
        api.setAuthorization();
    }).catch(() => {
        throw new Error()
    })
}

function forgotPassword(params) {
    const baseUrl = '/auth/forget-password'
    return api.create(`${baseUrl}`, params).then((resp) => {
        const {message} = resp;
        RToast(message, 'success');
    }).catch(() => {
        throw new Error()
    })
}

function resetPassword(params) {
    const baseUrl = '/auth/reset-password'
    return api.create(baseUrl, params).then((resp) => {
        const {message} = resp;
        RToast(message, 'success');
    }).catch(() => {
        throw new Error()
    })
}

export {login, logout, forgotPassword, resetPassword}