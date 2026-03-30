import {ApiParams, YearType} from "@/common/types";
import {apiCore} from "@/common/api/apiCore";

const api = new apiCore()

export async function getYear(params?: ApiParams) {
    const baseUrl = '/public/year'
    const result = await api.get<YearType[]>(baseUrl, params);
    return result.status === 'success' ? result.result : [];
}