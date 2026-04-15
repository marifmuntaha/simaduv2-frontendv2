import {LadderType} from "@/common/types";

export type LevelType = {
    id?: number;
    ladderId?: number;
    name: string;
    alias: string;
    description?: string;
    ladder?: Partial<LadderType>
    created_at?: string;
    updated_at?: string;
}
