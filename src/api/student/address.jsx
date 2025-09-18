import {APICore} from '../APICore';

const api = new APICore();

async function get(params, message) {
    const baseUrl = '/student/address'
    const result = await api.get(baseUrl, params, message).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params, message) {
    const baseUrl = '/student/address'
    return await api.create(baseUrl, params, message).then((resp) => resp);
}

async function update(params, message) {
    const baseUrl = `/student/address/${params.id}`
    return await api.updateWithFile(baseUrl, params, message).then((resp) => resp);
}

async function destroy(id, message) {
    const baseUrl = `/student/address/${id}`
    return await api.delete(baseUrl, message).then((resp) => resp);
}

export {get, store, update, destroy}