import { apiCore } from '@/common/api/apiCore'
import { ApiParams } from "@/common/types/api";
import { MajorType } from "@/common/types";

const api = new apiCore()

async function get(params?: ApiParams) {
    const baseUrl = '/master/major'
    const result = await api.get<MajorType[]>(baseUrl, params);
    return result.status === 'success' ? result.result : []
}

async function store(params: MajorType) {
    const baseUrl = '/master/major'
    return await api.create<MajorType>(baseUrl, params);
}

async function update(params: MajorType) {
    const baseUrl = `/master/major/${params.id}`
    return await api.update(baseUrl, params);
}

async function destroy(id: number | string) {
    const baseUrl = `/master/major/${id}`
    return await api.delete(baseUrl);
}

export { get, store, update, destroy }
