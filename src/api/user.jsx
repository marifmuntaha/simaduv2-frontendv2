import {APICore} from '@/api/APICore'
import {RToast} from "@/components";

const api = new APICore()

function get(params) {
    const baseUrl = '/user'
    return api.get(baseUrl, params).then((resp) => {
        return resp.result
    })
}

async function store(params) {
    const baseUrl = '/user'
    return api.createWithFile(baseUrl, params).then((resp) => {
        const {result} = resp
        return result;
    }).catch(() => {
        throw new Error()
    });
}

function update(params) {
    const baseUrl = `/user/${params.id}`
    return api.updateWithFile(baseUrl, params).then((resp) => {
        const {message, result} = resp
        RToast(message, 'success');
        return result;
    }).catch(() => {
        throw new Error()
    });
}

function destroy(id) {
    const baseUrl = `/user/${id}`
    return api.delete(baseUrl).then((resp) => {
        const {message} = resp
        return message;
    }).catch(() => {
        throw new Error()
    });
}

export {get, store, update, destroy}