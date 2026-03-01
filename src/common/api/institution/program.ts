import { apiCore } from '@/common/api/apiCore';
import type { ApiParams } from "@/common/types/api";
import type { ProgramType } from "@/common/types";

const api = new apiCore()

async function get<T>(params?: ApiParams) {
    const baseUrl = '/institution/program'
    const result = await api.get<T>(baseUrl, params)
    return result.status === 'success' ? result.result : [];
}

async function store(params: ProgramType) {
    const baseUrl = '/institution/program'
    return await api.create<ProgramType>(baseUrl, params)
}

async function update(params: ProgramType) {
    const baseUrl = `/institution/program/${params.id}`
    return await api.update(baseUrl, params)
}

async function destroy(id: number | undefined) {
    const baseUrl = `/institution/program/${id}`
    return await api.delete(baseUrl)
}

export { get, store, update, destroy }
