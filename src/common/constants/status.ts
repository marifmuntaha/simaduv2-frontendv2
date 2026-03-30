import {OptionsType} from "@/common/types";

export const TEACHER_STATUS: {id: number, name: string, color: string}[] = [
    {id: 1, name: 'Aktif', color: 'success'},
    {id: 2, name: 'Keluar', color: 'danger'},
    {id: 3, name: 'Pensiun', color: 'warning'},
    {id: 4, name: 'Meninggal Dunia', color: 'dark'},
]

export const teacherStatus = (statusId: number) => {
    return TEACHER_STATUS.find(item => item.id === statusId);
}

export const TEACHER_STATUS_OPTIONS: OptionsType[] = TEACHER_STATUS.map((item) => {
    return {value: item.id, label: item.name};
})