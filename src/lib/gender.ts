import {GENDER} from "@/common/constants";
import {OptionsType} from "@/common/types";

export const gender = (genderId: number) => {
    return GENDER.find((item) => item.id === genderId)?.id;
}
export const GENDER_OPTIONS: OptionsType[] = GENDER.map((item) => {
    return {value: item.id, label: item.name};
})