import {apiCore} from '@/common/api/apiCore';
import {ApiParams} from "@/common/types/api";
import {TeacherActivityType} from "@/common/types";

const api = new apiCore()

async function get<T>(params: ApiParams, notification: boolean = false) {
    const baseUrl = '/teacher/activity'
    const result = await api.get<T[]>(baseUrl, params, notification);
    return result.status === "success" ? result : []
}

async function store(params: TeacherActivityType, notification: boolean = false) {
    const baseUrl = '/teacher/activity'
    return await api.create<TeacherActivityType>(baseUrl, params, notification);
}

async function update(params: TeacherActivityType, notification: boolean = false) {
    const baseUrl = `/teacher/activity/${params.id}`
    return await api.update<TeacherActivityType>(baseUrl, params, notification);
}

async function destroy(id: number|undefined, notification: boolean = false) {
    const baseUrl = `/teacher/activity/${id}`
    return await api.delete(baseUrl, notification).then((resp) => resp);
}

export {get, store, update, destroy}
