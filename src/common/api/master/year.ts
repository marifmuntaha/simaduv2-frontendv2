import { apiCore } from '@/common/api/apiCore'
import { ApiParams } from "@/common/types/api";
import { YearType } from "@/common/types";

const api = new apiCore()

async function get<T>(params?: ApiParams) {
    const baseUrl = '/master/year'
    const result = await api.get<T[]>(baseUrl, params);
    return result.status === 'success' ? result.result : [];
}

async function store(params: YearType) {
    const baseUrl = '/master/year'
    return await api.create<YearType>(baseUrl, params);
}

async function update(params: YearType) {
    const baseUrl = `/master/year/${params.id}`
    return await api.update(baseUrl, params);
}

async function destroy(id: number | string) {
    const baseUrl = `/master/year/${id}`
    return await api.delete(baseUrl);
}

export { get, store, update, destroy }
