import {APICore} from '@/api/APICore'
import {RToast} from "@/components";

const api = new APICore()

async function get(params) {
    const baseUrl = '/notification'
    const result =  await api.get(baseUrl, params).then((resp) => resp)
    return result !== false ? result : [];
}

function update(params) {
    const baseUrl = `/notification/${params.id}`
    return api.updateWithFile(baseUrl, params).then((resp) => {
        const {message, result} = resp
        RToast(message, 'success');
        return result;
    }).catch(() => {
        throw new Error()
    });
}

export {get,  update}
