import {APICore} from '@/api/APICore';

const api = new APICore()

async function get(params) {
    const baseUrl = '/institution'
    const result = await api.get(baseUrl, params).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params) {
    const baseUrl = '/institution'
    return await api.createWithFile(baseUrl, params).then((resp) => resp);
}

async function update(params) {
    const baseUrl = `/institution/${params.id}`
    return await api.updateWithFile(baseUrl, params).then((resp) => resp);
}

async function destroy(id) {
    const baseUrl = `/institution/${id}`
    return await api.delete(baseUrl).then((resp) => resp);
}

export {get, store, update, destroy}
