import {APICore} from '@/api/APICore';

const api = new APICore()

async function get(params) {
    const baseUrl = '/institution/program'
    const result = await api.get(baseUrl, params).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params) {
    const baseUrl = '/institution/program'
    return await api.create(baseUrl, params).then((resp) => resp);
}

async function update(params) {
    const baseUrl = `/institution/program/${params.id}`
    return await api.update(baseUrl, params).then((resp) => resp);
}

async function destroy(id) {
    const baseUrl = `/institution/program/${id}`
    return await api.delete(baseUrl).then((resp) => resp);
}

export {get, store, update, destroy}
