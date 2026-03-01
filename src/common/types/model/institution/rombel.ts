import {InstitutionType, LevelType, MajorType, YearType, TeacherType} from "@/common/types";

export type RombelType = {
    id?: number;
    yearId?: number;
    institutionId?: number;
    levelId?: number;
    majorId?: number;
    teacherId?: number;
    name: string;
    alias: string;
    year?: YearType;
    institution?: InstitutionType;
    level?: LevelType;
    major?: MajorType;
    teacher?: TeacherType;

}