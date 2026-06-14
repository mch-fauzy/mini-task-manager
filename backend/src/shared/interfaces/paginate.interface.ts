/** Pagination metadata attached to list responses (serialized as snake_case on the wire). */
export interface IPaginateMeta {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

/** Repository pagination result: the page of items plus the unfiltered total. */
export interface IPaginateResult<T> {
    items: T[];
    total: number;
}
