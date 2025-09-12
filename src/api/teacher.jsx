import {APICore} from '@/api/APICore'
import {RToast} from "@/components";

const api = new APICore()

function get(params) {
    const baseUrl = '/teacher'
    return api.get(baseUrl, params).then((resp) => {
        return resp.result
    })
}

async function store(params) {
    const baseUrl = '/teacher'
    return api.create(baseUrl, params).then((resp) => {
        const {result} = resp
        return result;
    }).catch(() => {
        throw new Error()
    });
}

function update(params) {
    const baseUrl = `/teacher/${params.id}`
    return api.updateWithFile(baseUrl, params).then((resp) => {
        const {message} = resp
        RToast(message, 'success');
    }).catch(() => {
        throw new Error()
    });
}

function destroy(id) {
    const baseUrl = `/teacher/${id}`
    return api.delete(baseUrl).then((resp) => {
        const {message} = resp
        RToast(message, 'success');
    }).catch(() => {
        throw new Error()
    });
}

export {get, store, update, destroy}