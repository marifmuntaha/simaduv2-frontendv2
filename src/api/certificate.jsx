import {APICore} from '@/api/APICore';

const api = new APICore()

async function get(params) {
    const baseUrl = '/certificate'
    const result = await api.get(baseUrl, params).then((resp) => resp);
    return result !== false ? result : [];
}

async function store(params) {
    const baseUrl = '/certificate'
    return await api.create(baseUrl, params).then((resp) => resp);
}

async function destroy(id) {
    const baseUrl = `/certificate/${id}`
    return await api.delete(baseUrl).then((resp) => resp);
}

export {get, store, destroy}
