export type TeacherType = {
    id?: number;
    userId?: number
    fullName?: string
    name: string
    pegId: string
    birthplace: string
    birthdate: string
    gender: number
    frontTitle: string
    backTitle: string
    phone: string
    email: string
    address: string
    status: number
}
export * from "./activity"