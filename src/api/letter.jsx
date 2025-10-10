import {APICore} from '@/api/APICore';

const api = new APICore()

async function get(params) {
    const baseUrl = '/letter'
    const result = await api.get(baseUrl, params).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params) {
    const baseUrl = '/letter'
    return await api.createWithFile(baseUrl, params).then((resp) => resp);
}

async function update(params) {
    const baseUrl = `/letter/${params.id}`
    return await api.updateWithFile(baseUrl, params).then((resp) => resp);
}

async function destroy(id) {
    const baseUrl = `/letter/${id}`
    return await api.delete(baseUrl).then((resp) => resp);
}

async function print(id) {
    const baseUrl = `/letter/print/${id}`
    return await api.create(baseUrl).then((resp) => resp);
}
export {get, store, update, destroy, print}
