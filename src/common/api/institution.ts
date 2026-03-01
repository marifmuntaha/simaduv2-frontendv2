import {apiCore} from '@/common/api/apiCore';
import type {ApiParams} from "@/common/types/api";
import {InstitutionType} from "@/common/types";

const api = new apiCore()

async function get<T>(params?: ApiParams) {
    const baseUrl = '/institution'
    const result = await api.get<T[]>(baseUrl, params).then((resp) => resp);
    return result.status === 'success' ? result.result : [];
}

async function store(params: InstitutionType) {
    const baseUrl = '/institution'
    return await api.createWithFile<InstitutionType>(baseUrl, params)
}

async function update(params: InstitutionType) {
    const baseUrl = `/institution/${params.id}`
    return await api.updateWithFile(baseUrl, params)
}

async function destroy(id: number|undefined) {
    const baseUrl = `/institution/${id}`
    return await api.delete(baseUrl)
}

export {get, store, update, destroy}
