import { apiCore } from '@/common/api/apiCore'
import { ApiParams } from "@/common/types/api";
import { LevelType } from "@/common/types";

const api = new apiCore()

async function get<T>(params?: ApiParams) {
    const baseUrl = '/master/level';
    const result = await api.get<T[]>(baseUrl, params);
    return result.status === 'success' ? result.result : [];
}

async function store(params: LevelType) {
    const baseUrl = '/master/level'
    return await api.create<LevelType>(baseUrl, params);
}

async function update(params: LevelType) {
    const baseUrl = `/master/level/${params.id}`
    return await api.update(baseUrl, params);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/master/level/${id}`
    return await api.delete(baseUrl);
}

export { get, store, update, destroy }
