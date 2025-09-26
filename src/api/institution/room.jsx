import {APICore} from '@/api/APICore';

const api = new APICore()

async function get(params) {
    let baseUrl = `/institution/room`;
    if (params.id) {
        baseUrl = `/institution/room/${params.id}`;
    }
    const result = await api.get(baseUrl, params).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params) {
    const baseUrl = '/institution/room'
    return api.create(baseUrl, params).then((resp) => resp);
}

async function update(params) {
    const baseUrl = `/institution/room/${params.id}`
    return await api.update(baseUrl, params).then((resp) => resp);
}

async function destroy(id) {
    const baseUrl = `/institution/room/${id}`
    return await api.delete(baseUrl).then((resp) => resp);
}

export {get, store, update, destroy}
