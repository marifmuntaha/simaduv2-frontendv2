import {APICore} from './APICore.jsx'
import {RToast} from "@/components";

const api = new APICore()

async function login(params) {
    const baseUrl = '/auth/login'
    return await api.create(baseUrl, params).then((resp) => {
        api.setLoggedInUser(resp);
        api.setAuthorization(resp.user);
    })
}

async function logout() {
    const baseUrl = '/auth/logout'
    return await api.create(`${baseUrl}`).then(() => {
        api.setLoggedInUser();
        api.setAuthorization();
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
