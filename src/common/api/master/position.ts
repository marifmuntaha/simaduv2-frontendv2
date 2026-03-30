import { apiCore } from '@/common/api/apiCore'
import { ApiParams } from "@/common/types/api";
import { PositionType } from "@/common/types";

const api = new apiCore()

async function get<T>(params?: ApiParams) {
    const baseUrl = '/master/position'
    const result = await api.get<T[]>(baseUrl, params);
    return result.status === 'success' ? result.result : [];
}

async function store(params: PositionType) {
    const baseUrl = '/master/position'
    return await api.create<PositionType>(baseUrl, params);
}

async function update(params: PositionType) {
    const baseUrl = `/master/position/${params.id}`
    return await api.update(baseUrl, params);
}

async function destroy(id: number | string) {
    const baseUrl = `/master/position/${id}`
    return await api.delete(baseUrl);
}

export { get, store, update, destroy }
