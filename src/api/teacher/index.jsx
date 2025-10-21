import {APICore} from '@/api/APICore';

const api = new APICore()

async function get(params, message) {
    const baseUrl = '/teacher'
    const result = await api.get(baseUrl, params, message).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params, message) {
    const baseUrl = '/teacher'
    return await api.create(baseUrl, params, message).then((resp) => resp);
}

async function update(params, message) {
    const baseUrl = `/teacher/${params.id}`
    return await api.update(baseUrl, params, message).then((resp) => resp);
}

async function destroy(id, message) {
    const baseUrl = `/teacher/${id}`
    return await api.delete(baseUrl, message).then((resp) => resp);
}

export {get, store, update, destroy}
