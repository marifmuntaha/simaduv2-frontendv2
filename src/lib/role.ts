import {ROLE} from "@/common/constants";
import {OptionsType} from "@/common/types";

export const role = (roleId: number) => {
   const role = ROLE.find((item) => item.id === roleId);
   return role ? role.name : undefined;
}

export const ROLE_OPTIONS: OptionsType[] = ROLE.map((item) => ({value: item.id, label: item.name}));