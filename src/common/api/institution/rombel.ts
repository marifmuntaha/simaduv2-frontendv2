import {apiCore} from '@/common/api/apiCore';
import {ApiData, ApiParams} from "@/common/types/api";
import {RombelType} from "@/common/types/model/institution/rombel";

const api = new apiCore()

async function get<T>(params: ApiParams) {
    const baseUrl = `/institution/rombel`;
    if (params.id) {
        const baseUrl = `/institution/rombel/${params.id}`;
    }
    const result = await api.get<T>(baseUrl, params)
    return result.status === 'success' ? result.result : [];
}

async function store(params: RombelType) {
    const baseUrl = '/institution/rombel'
    return api.create<RombelType>(baseUrl, params).then((resp) => resp.result)
}

async function update(params: RombelType) {
    const baseUrl = `/institution/rombel/${params.id}`
    return await api.update<RombelType>(baseUrl, params)
}

async function destroy(id: number|undefined) {
    const baseUrl = `/institution/rombel/${id}`
    return await api.delete(baseUrl)
}

export {get, store, update, destroy}
