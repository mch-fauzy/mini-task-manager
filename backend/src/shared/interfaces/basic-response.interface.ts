import { IPaginateMeta } from './paginate.interface';

/** Success envelope returned by every endpoint (serialized as snake_case on the wire). */
export interface IBasicResponse<T> {
    data: T;
    message: string;
    meta?: IPaginateMeta;
}
