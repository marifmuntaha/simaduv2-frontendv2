import { apiCore } from './apiCore'
import { ApiData, ApiResponse, LoggedInUser } from '../types/api';
import { UserType } from "@/common/types";
import { RToast } from "@/components";

const api = new apiCore()

async function login(params: ApiData): Promise<LoggedInUser | undefined> {
    const baseUrl = '/auth/login'
    return await api.create<LoggedInUser>(baseUrl, params)
        .then((resp: ApiResponse<LoggedInUser>) => {
            if (resp.status === 'success') {
                api.setLoggedInToken(resp.result)
                return { user: resp.result.user, token: resp.result.token };
            }
            return undefined
        })
}

async function logout() {
    const baseUrl = '/auth/logout'
    return await api.create(baseUrl, {}).then(() => {
        api.setLoggedInToken();
        api.setAuthorization(null);
    })
}

function forgotPassword(params: ApiData) {
    const baseUrl = '/auth/forget-password'
    return api.create(baseUrl, params).catch(() => {
        throw new Error()
    })
}

function resetPassword(params: ApiData) {
    const baseUrl = '/auth/reset-password'
    return api.create(baseUrl, params).catch(() => {
        throw new Error()
    })
}

async function profile(): Promise<UserType | undefined> {
    const baseUrl = '/auth/profile';
    return await api.get<UserType>(baseUrl, {}, false)
        .then((resp) => {
            if (resp.result) {
                return resp.result;
            }
            else {
                RToast(resp.statusMessage)
                api.setLoggedInToken(undefined)
                if (!window.location.pathname.includes('/auth/masuk')) {
                    window.location.href = '/auth/masuk';
                }
            }
        })
}

export { login, logout, forgotPassword, resetPassword, profile }

