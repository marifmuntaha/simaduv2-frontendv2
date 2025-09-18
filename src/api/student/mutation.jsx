import {APICore} from '../APICore';

const api = new APICore();

async function get(params, message) {
    const baseUrl = '/student/mutation'
    const result = await api.get(baseUrl, params, message).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params, message) {
    const baseUrl = '/student/mutation'
    return await api.createWithFile(baseUrl, params, message).then((resp) => resp);
}

async function update(params, message) {
    const baseUrl = `/student/mutation/${params.id}`
    return await api.updateWithFile(baseUrl, params, message).then((resp) => resp);
}

async function destroy(id, message) {
    const baseUrl = `/student/mutation/${id}`
    return await api.delete(baseUrl, message).then((resp) => resp);
}

export {get, store, update, destroy}
