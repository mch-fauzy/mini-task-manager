/** A predefined actor. There is no auth: actors are a fixed list chosen via a dropdown. */
export interface IActor {
    id: string;
    name: string;
}

/**
 * Hardcoded actor list. Single source for the actor dropdown (GET /actors) and for the
 * actor_name snapshot written into the audit log on each effective status change.
 */
export const ACTOR_LIST: readonly IActor[] = [
    { id: 'john.doe', name: 'John Doe' },
    { id: 'jane.roe', name: 'Jane Roe' },
    { id: 'alex.kim', name: 'Alex Kim' },
] as const;
