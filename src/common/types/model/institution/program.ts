import {InstitutionType, YearType} from "@/common/types";

export type ProgramType = {
    id?: number;
    yearId?: number;
    institutionId?: number;
    name: string;
    alias: string;
    year?: YearType;
    institution?: InstitutionType;
}