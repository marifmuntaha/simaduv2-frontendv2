import { apiCore } from '@/common/api/apiCore'
import { ApiParams } from "@/common/types/api";
import { LadderType } from "@/common/types";

const api = new apiCore()

async function get<T>(params?: ApiParams) {
    const baseUrl = '/master/ladder';
    const result = await api.get<T[]>(baseUrl, params);
    return result.status === 'success' ? result.result : [];
}

async function store(params: LadderType) {
    const baseUrl = '/master/ladder'
    return await api.create<LadderType>(baseUrl, params);
}

async function update(params: LadderType) {
    const baseUrl = `/master/ladder/${params.id}`
    return await api.update(baseUrl, params);
}

async function destroy(id: number|undefined) {
    const baseUrl = `/master/ladder/${id}`
    return await api.delete(baseUrl);
}

export { get, store, update, destroy }
