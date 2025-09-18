import {APICore} from '@/api/APICore';

const api = new APICore()

async function get(params) {
    const baseUrl = '/teacher'
    const result = await api.get(baseUrl, params).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params) {
    const baseUrl = '/teacher'
    return await api.create(baseUrl, params).then((resp) => resp);
}

async function update(params) {
    const baseUrl = `/teacher/${params.id}`
    return await api.update(baseUrl, params).then((resp) => resp);
}

async function destroy(id) {
    const baseUrl = `/teacher/${id}`
    return await api.delete(baseUrl).then((resp) => resp);
}

export {get, store, update, destroy}
