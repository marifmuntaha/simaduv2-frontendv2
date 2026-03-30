import {InstitutionType, YearType} from "@/common/types";

export type UserType = {
    id?: number;
    name?: string;
    email: string;
    username: string;
    password: string;
    password_confirmation?: string;
    phone: string;
    role: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
    institution?: InstitutionType;
    year?: YearType;
}