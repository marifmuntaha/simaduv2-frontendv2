import {apiCore} from '@/common/api/apiCore'
import {ApiParams, UserType} from "@/common/types";

const api = new apiCore();

async function get<T>(params: ApiParams) {
    const baseUrl = '/user'
    const result =  await api.get<T[]>(baseUrl, params);
    return result.status === 'success' ? result.result : [];
}

async function store(params: UserType, message: boolean = true) {
    const baseUrl = '/user'
    return await api.create<UserType>(baseUrl, params, message);
}

async function update(params: UserType, message: boolean = true) {
    const baseUrl = `/user/${params.id}`
    return await api.update<UserType>(baseUrl, params, message);
}

async function destroy(id: number|undefined, message:boolean = true) {
    const baseUrl = `/user/${id}`
    return await api.delete<UserType>(baseUrl, message);
}

export {get, store, update, destroy}
