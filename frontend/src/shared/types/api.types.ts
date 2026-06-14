export interface IApiResponse<T> {
    data: T;
    message: string;
}

export interface IPaginateMeta {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export interface IPaginatedResponse<T> {
    data: T[];
    meta: IPaginateMeta;
    message: string;
}
