import {APICore} from '../APICore';

const api = new APICore()

async function get(params, message) {
    const baseUrl = '/finance/discount'
    const result = await api.get(baseUrl, params, message).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params, message) {
    const baseUrl = '/finance/discount'
    return await api.create(baseUrl, params, message).then((resp) => resp);
}

async function show(params, message) {
    const baseUrl = `/finance/discount/${params}`
    return await api.get(baseUrl, params, message).then((resp) => resp);
}

async function update(params, message) {
    const baseUrl = `/finance/discount/${params.id}`
    return await api.update(baseUrl, params, message).then((resp) => resp);
}

async function destroy(id, message) {
    const baseUrl = `/finance/discount/${id}`
    return await api.delete(baseUrl, message).then((resp) => resp);
}

export {get, store, show, update, destroy}
