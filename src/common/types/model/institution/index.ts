import {LadderType} from "@/common/types";

export type InstitutionType = {
    id?: number;
    ladderId?: number;
    name: string;
    alias: string;
    nsm: string;
    npsn: string;
    address: string
    phone: string;
    email: string;
    website: string;
    logo: string;
    image?: File | null;
    ladder?: LadderType;
}