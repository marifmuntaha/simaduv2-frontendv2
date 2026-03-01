import {apiCore} from '@/common/api/apiCore';

const api = new apiCore()

async function get(params, message) {
    const baseUrl = '/letter'
    const result = await api.get(baseUrl, params, message).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params, message) {
    const baseUrl = '/letter'
    return await api.createWithFile(baseUrl, params, message).then((resp) => resp);
}

async function update(params, message) {
    const baseUrl = `/letter/${params.id}`
    return await api.updateWithFile(baseUrl, params, message).then((resp) => resp);
}

async function destroy(id, message) {
    const baseUrl = `/letter/${id}`
    return await api.delete(baseUrl, message).then((resp) => resp);
}

async function print(id, message) {
    const baseUrl = `/letter/print/${id, message}`
    return await api.create(baseUrl).then((resp) => resp);
}
export {get, store, update, destroy, print}
