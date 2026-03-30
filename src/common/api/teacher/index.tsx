import {apiCore} from '@/common/api/apiCore';
import {ApiParams, TeacherType} from "@/common/types";

const api = new apiCore()

async function get<T>(params: ApiParams) {
    const baseUrl = '/teacher'
    const fetch = await api.get<T[]>(baseUrl, params)
    return fetch.status === 'success' ? fetch.result : [];
}

async function store(params: TeacherType, message:boolean = true) {
    const baseUrl = '/teacher'
    return await api.create<TeacherType>(baseUrl, params, message);
}

async function update(params: TeacherType, message: boolean = true) {
    const baseUrl = `/teacher/${params.id}`
    return await api.update<TeacherType>(baseUrl, params, message);
}

async function destroy(id: number|undefined, message: boolean = true) {
    const baseUrl = `/teacher/${id}`
    return await api.delete(baseUrl, message);
}

export {get, store, update, destroy}
