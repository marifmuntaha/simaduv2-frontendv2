import {APICore} from './APICore'
import {RToast} from "@/components";

const api = new APICore()

function get(params) {
    const baseUrl = '/student'
    return api.get(baseUrl, params).then((resp) => {
        return resp.result
    })
}

async function store(params) {
    const baseUrl = '/student'
    return api.createWithFile(baseUrl, params).then((resp) => {
        const {message, result} = resp
        RToast(message, 'success');
        return result;
    }).catch(() => {
        throw new Error()
    });
}

function show(params) {
    const baseUrl = `/student/${params}`
    return api.get(baseUrl, params).then((resp) => {
        return resp.result
    })
}

function update(params) {
    const baseUrl = `/student/${params.id}`
    return api.updateWithFile(baseUrl, params).then((resp) => {
        const {message} = resp
        RToast(message, 'success');
    }).catch(() => {
        throw new Error()
    });
}

function destroy(id) {
    const baseUrl = `/student/${id}`
    return api.delete(baseUrl).then((resp) => {
        const {message} = resp
        RToast(message, 'success');
    }).catch(() => {
        throw new Error()
    });
}

export {get, store, show, update, destroy}