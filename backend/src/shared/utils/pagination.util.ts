import { IPaginateMeta } from '../interfaces/paginate.interface';

export const PaginationUtil = {
    /** Build the list `meta` block; `totalPages` is `ceil(total / perPage)`, or 0 when empty. */
    buildMeta(total: number, page: number, perPage: number): IPaginateMeta {
        return { total, page, perPage, totalPages: total === 0 ? 0 : Math.ceil(total / perPage) };
    },
};
