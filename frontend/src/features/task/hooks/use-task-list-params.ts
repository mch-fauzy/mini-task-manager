import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { TASK_SORT_FIELDS, TASK_SORT_ORDERS } from '../constants/task-list.constant';

// Parsers and URL options live at module scope (the nuqs-recommended pattern) so
// they are not rebuilt on every render.
const taskListParsers = {
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: parseAsStringLiteral(TASK_SORT_FIELDS).withDefault('created_at'),
    order: parseAsStringLiteral(TASK_SORT_ORDERS).withDefault('DESC'),
};

// replace: update the URL in place so refresh and shareable links work without
// bloating history (page size is a preference, not a navigation step). urlKeys:
// snake_case in the URL to match the backend wire format (state stays camelCase).
const taskListUrlOptions = { history: 'replace' as const, urlKeys: { perPage: 'per_page' } };

/**
 * Task list params (page, size, sort) held in the URL so the view survives a
 * refresh, is shareable, and the back button steps through pages. Invalid or
 * missing query params fall back to the defaults above. Returns the same
 * [params, setParams] tuple shape as useState.
 */
export function useTaskListParams() {
    return useQueryStates(taskListParsers, taskListUrlOptions);
}
