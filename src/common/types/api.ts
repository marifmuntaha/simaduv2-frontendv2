export interface ApiResponse<T = any | false> {
    status: 'success' | 'error';
    statusMessage: string;
    statusCode?: number;
    result: T;
}

export interface LoggedInUser {
    token: string;
    user: any;
    subscription?: any;
}

export type ApiParams = Record<string, string | number | boolean>;
export type ApiData = any;

export interface AxiosErrorResponse {
    code?: string;
    response?: {
        status: number;
        data: {
            statusMessage: string;
            [key: string]: any;
        };
    };
    data?: ApiResponse;
}
